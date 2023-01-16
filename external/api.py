from flask import Flask, request, jsonify
import asyncio
import requests
from flask_cors import CORS
from web3 import Web3
from eth_account.messages import encode_defunct
from eth_account import Account
from pyppeteer.launcher import launch
import aiohttp
from PIL import Image
import time
import json
import base64

w3 = Web3(Web3.HTTPProvider("https://bsc-dataseed.binance.org/"))

def GetData():
    with open("external/db.json", "r") as f:
        return json.load(f)

def sortBlockchainData(chunks, address):
    accountIds = []
    obj = {}
    txIn = []
    txOut = []

    for i in chunks:
        if i["from"] == i["to"]:
            pass
        elif i["from"] == address:
            txOut.append(i["tokenID"])
        else:
            txIn.append(i["tokenID"])
    for i in txOut:
        if not obj.get(i):
            obj[i] = []
        obj[i].append(i)

    for i in txIn:
        if not obj.get(i):
            obj[i] = []
        obj[i].append(i)
    
    for i in txIn:
        if len(obj[i]) % 2 != 0:
            accountIds.append(i)
    
    accountIds = list(set(accountIds))

    return accountIds

# def GetUri(rpcUrl, contractAddress, tokens):
#     data = GetData()
#     erc721abi = data["abi"][0]["erc721_standard"]
#     w3 = Web3(Web3.HTTPProvider(rpcUrl))
#     contract = w3.eth.contract(abi=erc721abi, address=Web3.toChecksumAddress(contractAddress))
#     tokenUris = []
#     for token in tokens:
#         tokenUris.append({"token" : token, "uri" : contract.functions.tokenURI(int(token)).call()})
#     return tokenUris

def GetUri(baseUri, id):
    try:
        baseUri = baseUri.split("/")
        baseUri[baseUri.index("PLACEHOLDER")] = id
        baseUri = "/".join(baseUri)
    except:
        baseUri = None
    return baseUri

def LookIfVerified(contract):
    try:
        project = [i for i in GetData()["projects"] if i["contract_address"].upper() == contract.upper()][0]
        return project
    except:
        return False


def GenerateUris(data):
    abi = GetData()["abi"][0]["erc721_standard"]
    for x in data:
        if x["base_uri"] == "":
            try:
                w3 = Web3(Web3.HTTPProvider([i["rpc"] for i in GetData()["external_api"] if i["chain_id"] == x["chain_id"]][0]))
                contract = w3.eth.contract(address=Web3.toChecksumAddress(x["contract_address"]), abi=abi)
                uri = contract.functions.tokenURI(int(x["ids"][0])).call().split("/")
                uri[uri.index(x["ids"][0])] = "PLACEHOLDER"
                uri = '/'.join(uri)
                x["base_uri"] = uri
            except:
                pass
    for x in data:
        updatedTokens = []
        for i in x["ids"]:
            updatedTokens.append({
                "id" : i,
                "uri" : GetUri(x["base_uri"], i)
            })
        x["ids"] = updatedTokens
    return data

async def fetch_url(session, x, i):
    response = await session.get(i["uri"], ssl=False)
    json_response = await response.json()
    try:
        return {"contract" : x["contract_address"], "chain_id" : x["chain_id"], "data" : json_response, "id" : i["id"], "image": json_response["image"], "name" : json_response["name"], "verifed_project" : LookIfVerified(x["contract_address"])}
    except:
        return {"contract" : x["contract_address"], "chain_id" : x["chain_id"], "data" : json_response, "id" : i["id"], "verifed_project" : LookIfVerified(x["contract_address"])}
def PrepareFetchTasks(session, data):
    tasks = []
    for x in data:
        for i in x["ids"]:
            if type(i["uri"]) == str:
                tasks.append(
                    fetch_url(session=session, x=x, i=i)
                )
    return tasks


async def GetUriData(data):
    async with aiohttp.ClientSession() as session:
        tasks = PrepareFetchTasks(
            session=session, data=data
        )
        responses = await asyncio.gather(*tasks)
    return responses

def assignResponseToToken(pending, response):
    sortObj = {}
    for i in response:
        if not sortObj.get(i["contract"]):
            sortObj[i["contract"]]=[]
        sortObj[i["contract"]].append(i)

    for key in sortObj:
        for x in pending:
            if key == x["contract_address"]:
                x["ids"] = sortObj[key]
    return pending

def getUsersItems(address):
    dbData = GetData()
    chunks = []
    for endpointInfo in dbData["external_api"]:
        page = 1
        while True:
            chunk = json.loads(requests.get(endpointInfo["endpoint"] + f'api?module=account&action=tokennfttx&address={address}&page={page}&offset=10000&startblock=0&endblock=999999999&sort=asc&apikey={endpointInfo["keys"][1]}').text)
            if chunk["status"] != '1':
                break
            else:
                chunks.append({"chain_id" : endpointInfo["chain_id"], "chunk" : chunk["result"]})
                page += 1
    prepData = {}
    for chunk in chunks:
        for i in chunk["chunk"]:
            if not prepData.get(i["contractAddress"]):
                prepData[i["contractAddress"]] = {}
                prepData[i["contractAddress"]]["tokens"] = []
                prepData[i["contractAddress"]]["chain_id"] = chunk["chain_id"]
                prepData[i["contractAddress"]]["project_name"] = i["tokenName"]
            prepData[i["contractAddress"]]["tokens"].append(i)
    pendingTokenData = []
    for key in prepData:
        tokenIds = sortBlockchainData(address=address, chunks=prepData[key]["tokens"])
        pendingTokenData.append({"contract_address" : key, "chain_id" : prepData[key]["chain_id"], "ids" : tokenIds, "base_uri" :"", "project_name": prepData[key]["project_name"]})
    pendingTokenData = GenerateUris(pendingTokenData)
    unsortedData = asyncio.run(GetUriData(pendingTokenData))
    finalData = assignResponseToToken(pending=pendingTokenData, response=unsortedData)
    return finalData


def ImageToB64(filename):
    ext = filename.split('.')[-1]
    prefix = f'data:image/{ext};base64,'
    with open(filename, 'rb') as f:
        img = f.read()
        return prefix + base64.b64encode(img).decode('utf-8')

def delResponse(_id):
    with open("external/db.json") as f:
        data = json.load(f)
        for i in data["responses"]:
            if i["id"] == _id:
                data["responses"].remove(i)
        with open("external/db.json", "w") as f:
            json.dump(data, f, indent=2)


def AppendToQueries(query):
    with open("external/db.json", "r") as f:
        data = json.load(f)
        data["queries"].append(query)
        with open("external/db.json", "w") as j:
            json.dump(data, j, indent=2)


def ValidateSignature(signature, message, address):
    message = encode_defunct(bytes(message, encoding='utf8'))
    return address.lower() == Account.recover_message(message, signature=signature).lower()

def handleImage(image, address):
        image = Image.open(image)
        image.save(f"external/profile_images/{address}.png")
        return f"external/profile_images/{address}.png"

api = Flask(__name__)
CORS(api)


@api.route("/responses/<_id>", methods=["GET"])
def getResponse(_id):
    if request.method == "GET":
        try:
            res = GetData()["responses"]
            for item in res:
                if item["id"] == _id:
                    delResponse(item["id"])
                    return jsonify(item)
                else:
                    return jsonify({"query_status": "Pending"})
        except:
            if len([item for item in GetData()["queries"] if item["id"] == _id]) > 0:
                return jsonify({"query_status": "Pending"})
            else:
                return "Error, no data found under that id"
    else:
        return "Error, can only perform GET request to endpoint"


@api.route("/")
def baseDir():
    return "Hi"


@api.route("/cards", methods=["GET"])
def handleGetCards():
    if request.method == "GET":
        return jsonify(GetData()["cards"])
    else:
        return "Error, can only do GET request"


@api.route("/cards/<_id>", methods=["GET"])
def handleGetCard(_id):
    if request.method == "GET":
        for card in GetData()["cards"]:
            if card["id"] == _id:
                return jsonify(card)
            else:
                return "Error, card with that id not found"
    else:
        return "Error, can only do GET request"


@api.route("/queries", methods=["POST"])
def handlePost():
    data = request.get_json(silent=True)
    if data["address"].lower() is not None and data["id"] is not None:
        if (
            len(data["address"]) == 42
            and len(data["id"]) == 32
            and data["address"].startswith("0x")
        ):
            AppendToQueries(data)
            return jsonify({"Status": "Passed"})
    else:
        return jsonify({"Status": "Failed"})

@api.route("/create-account", methods=["POST"])
def handleCreateAccount():
    try:
        data = request.form
        try:
            avatar = request.files["avatar"]
            avatar = handleImage(avatar, data["address"].lower())
        except:
            avatar = False
        with open("external/db.json", "r") as f:
            j = json.load(f)
        if len([i for i in j["accounts"] if i["address"] == data["address"]]) != 0:
            return jsonify({"status" : False})
        if ValidateSignature(signature=data["signature"], message=data["message"], address=data["address"]):
            with open('external/db.json') as f:
                j = json.load(f)
                j["accounts"].append({"username": data["username"], "address" : data["address"], "avatar" : avatar})
                with open('external/db.json', "w") as f:
                    json.dump(j, f, indent=2)
            return jsonify({"status" : True})
    except:
        return jsonify({"status" : False})

@api.route("/account/<address>", methods=["GET"])
def handleGetAccount(address):
    try:
        data = [i for i in GetData()["accounts"] if i["address"].lower() == address][0]
        return jsonify({
            "username" : data["username"],
            "address" : data["address"].lower(),
            "avatar" : ImageToB64(data["avatar"])
        })
    except:
        return jsonify({"status" : False})

@api.route("/account/<address>/items", methods=["GET"])
def handleGetItems(address):
    return jsonify({
        "address" : address,
        "data" : getUsersItems(address=address)
    })



if __name__ == "__main__":
    api.run(port=8000, debug=True)
