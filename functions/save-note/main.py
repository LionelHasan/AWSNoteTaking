import json
import boto3
import urllib.request

dynamodb_resource = boto3.resource("dynamodb")
table = dynamodb_resource.Table("notes-30142893") 

def lambda_handler(event, context):

    try:
        # Setting the variable body to the json body attribute (sent by the endpoint via LambdaURL), json loads converts it to a python dictionary
        access_token = event["headers"]["access_token"]
        print(access_token)
        email = event["queryStringParameters"]["email"]
        id = event["queryStringParameters"]["id"]

        print(id)

        google_url = f'https://www.googleapis.com/oauth2/v1/userinfo?access_token={access_token}'
        headers = {'Authorization': f'Bearer {access_token}', 'Accept': 'application/json'}
        req = urllib.request.Request(google_url, headers=headers)
        res = urllib.request.urlopen(req)
        data = json.loads(res.read().decode())
        email_returned = data['email']

        if(email != email_returned):
            return {
                "statusCode": 401,
                "body": json.dumps({
                    "message": "Authorization Invalid"
                })
            }
    except urllib.error.HTTPError as exp:
        print(exp)

    try:
        body = json.loads(event["body"])
        access_token = event["headers"]["access_token"]
        table.put_item(Item=body)
    except Exception as exp:
        print("exception: {exp}") # Can send the exception to Cloudwatch
        return {
            "statusCode": 500,
            "body": json.dumps({
                "message": str(exp)
            })
        }
    
    return {
        "statusCode": 200,
        "body": json.dumps({
            "message": "success"
        })

    }