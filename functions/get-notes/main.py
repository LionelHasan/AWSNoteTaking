import json
import boto3
from boto3.dynamodb.conditions import Key

dynamodb_resource = boto3.resource("dynamodb")
table = dynamodb_resource.Table("notes") 

def lambda_handler(event, context):

        # Setting the variable body to the json body attribute (sent by the endpoint via LambdaURL), json loads converts it to a python dictionary
    email = event["queryStringParameters"]["email"]

    print(event)

    try:
        res = table.query(KeyConditionExpression=Key("email").eq(email))
        print(res["Items"])
            
        return {
            "statusCode": 200,
            "body": json.dumps(res["Items"])
                }

    except Exception as exp:
        print("exception: {exp}") # Can send the exception to Cloudwatch
        return {
            "statusCode": 500,
            "body": json.dumps({
                "message": str(exp)
            })
        }


    