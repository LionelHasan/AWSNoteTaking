# add your get-notes function here
import json
import boto3

def lambda_handler(event, context):
    dynamodb_resource = boto3.resource("dynamodb")
    table = dynamodb_resource.Table("notes") 

    try:
        email = event['queryStringParameters']['email']
        # noteID = event['queryStringParameters']['id']
        # response = table.get_item(Key={'email': f'{email}', 'id': f'{noteID}'})

        response = table.query( 
            KeyConditionExpression='email' + ' = :pk', 
            ExpressionAttributeValues={
            ':pk': email
        }
            )
        items = response['Items']
    
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
        # 'headers': {
        # 'Content-Type': 'application/json',
        # },
        # 'body': json.dumps({
        # "message": 'success',
        # 'body' : response,
        # })
        'body':json.dumps(items)
    }

