import requests
url = "http://localhost:5000/login"

# print(requests.post(url, payload))
# # print(requests.get(url).text)




payload = "{}"
headers = {
  'Content-Type': 'application/json'
}

response = requests.post( url, headers=headers, data = payload)

print(response.text)
