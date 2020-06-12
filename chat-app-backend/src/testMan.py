import requests
url = "http://localhost:5000/send"

# print(requests.post(url, payload))
# # print(requests.get(url).text)




# payload = "{\n\t\"username\":\"ravi\"\n}"
payload = "{\n\t\"username\":\"ravi\",\n\t\"message\":\"Everything will be alright\"\n}"

headers = {
  'Content-Type': 'application/json'
}

response = requests.post( url, headers=headers, data = payload)

print(response.text)
