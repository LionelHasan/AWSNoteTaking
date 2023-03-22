import json
import boto3


dynamodb_resource = boto3.resource("dynamodb")
table = dynamodb_resource.Table("notes") 

def lambda_handler(event, context):

        # Setting the variable body to the json body attribute (sent by the endpoint via LambdaURL), json loads converts it to a python dictionary
    body = json.loads(event["body"])
    print(body.get("id"))

    try:
        table.delete_item(Key={
            'id': body.get("id")
        }
        
        
        )
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

    