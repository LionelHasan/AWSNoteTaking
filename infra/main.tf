terraform {
  required_providers {
    aws = {
      version = ">= 4.0.0"
      source  = "hashicorp/aws"
    }
  }
}

# specify the provider region
provider "aws" {
  region = "ca-central-1"
}

# the locals block is used to declare constants that 
# you can use throughout your code
locals {
  function_name = "save-note30137476"
  delete_note = "delete-note30137476"
  get_note = "get-note30137476"
  handler_name  = "main.lambda_handler"
  artifact_name = "artifact.zip"
}

# create a role for the Lambda function to assume
# every service on AWS that wants to call other AWS services should first assume a role and
# then any policy attached to the role will give permissions
# to the service so it can interact with other AWS services
# see the docs: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role
resource "aws_iam_role" "lambda" {
  name               = "iam-for-lambda-${local.function_name}"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

# create archive file from main.py
data "archive_file" "lambda" {
  type = "zip"
  # this file (main.py) needs to exist in the same folder as this 
  # Terraform configuration file
  source_file = "../functions/save-note/main.py"
  output_path = "artifact.zip"
}

# create a Lambda function
# see the docs: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_function
resource "aws_lambda_function" "lambda" {
  role             = aws_iam_role.lambda.arn
  function_name    = local.function_name
  handler          = local.handler_name
  filename         = local.artifact_name
  source_code_hash = data.archive_file.lambda.output_base64sha256

  # see all available runtimes here: https://docs.aws.amazon.com/lambda/latest/dg/API_CreateFunction.html#SSS-CreateFunction-request-Runtime
  runtime = "python3.9"
}

# create a policy for publishing logs to CloudWatch
# see the docs: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_policy
resource "aws_iam_policy" "logs" {
  name        = "lambda-logging-${local.function_name}"
  description = "IAM policy for logging from a lambda"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
        "dynamodb:*"


      ],
      "Resource": ["arn:aws:logs:*:*:*", "arn:aws:dynamodb:*:*:table/*", "arn:aws:dynamodb:*:*:*/*"],
      "Effect": "Allow"
    }
  ]
}
EOF
}



# attach the above policy to the function role
# see the docs: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment
resource "aws_iam_role_policy_attachment" "lambda_logs" {
  role       = aws_iam_role.lambda.name
  policy_arn = aws_iam_policy.logs.arn
}

resource "aws_iam_role" "delete-lambda" {
  name               = "iam-for-lambda-${local.delete_note}"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

# create archive file from main.py
data "archive_file" "delete-lambda" {
  type = "zip"
  # this file (main.py) needs to exist in the same folder as this 
  # Terraform configuration file
  source_file = "../functions/delete-note/main.py"
  output_path = "artifact1.zip"
}

# create a Lambda function
# see the docs: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_function
resource "aws_lambda_function" "delete-lambda" {
  role             = aws_iam_role.lambda.arn
  function_name    = local.delete_note
  handler          = local.handler_name
  filename         = "artifact1.zip"
  source_code_hash = data.archive_file.delete-lambda.output_base64sha256

  # see all available runtimes here: https://docs.aws.amazon.com/lambda/latest/dg/API_CreateFunction.html#SSS-CreateFunction-request-Runtime
  runtime = "python3.9"
}

# create a policy for publishing logs to CloudWatch
# see the docs: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_policy
resource "aws_iam_policy" "delete-logs" {
  name        = "lambda-logging-${local.delete_note}"
  description = "IAM policy for logging from a lambda"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
        "dynamodb:*"


      ],
      "Resource": ["arn:aws:logs:*:*:*", "arn:aws:dynamodb:*:*:table/*", "arn:aws:dynamodb:*:*:*/*"],
      "Effect": "Allow"
    }
  ]
}
EOF
}



# attach the above policy to the function role
# see the docs: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment
resource "aws_iam_role_policy_attachment" "delete_logs" {
  role       = aws_iam_role.lambda.name
  policy_arn = aws_iam_policy.logs.arn
}





resource "aws_iam_role" "get-lambda" {
  name               = "iam-for-lambda-${local.get_note}"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

# create archive file from main.py
data "archive_file" "get-lambda" {
  type = "zip"
  # this file (main.py) needs to exist in the same folder as this 
  # Terraform configuration file
  source_file = "../functions/get-notes/main.py"
  output_path = "artifact2.zip"
}

# create a Lambda function
# see the docs: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_function
resource "aws_lambda_function" "get-lambda" {
  role             = aws_iam_role.lambda.arn
  function_name    = local.get_note
  handler          = local.handler_name
  filename         = "artifact2.zip"
  source_code_hash = data.archive_file.get-lambda.output_base64sha256

  # see all available runtimes here: https://docs.aws.amazon.com/lambda/latest/dg/API_CreateFunction.html#SSS-CreateFunction-request-Runtime
  runtime = "python3.9"
}

# create a policy for publishing logs to CloudWatch
# see the docs: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_policy
resource "aws_iam_policy" "get-logs" {
  name        = "lambda-logging-${local.get_note}"
  description = "IAM policy for logging from a lambda"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
        "dynamodb:*"


      ],
      "Resource": ["arn:aws:logs:*:*:*", "arn:aws:dynamodb:*:*:table/*", "arn:aws:dynamodb:*:*:*/*"],
      "Effect": "Allow"
    }
  ]
}
EOF
}



# attach the above policy to the function role
# see the docs: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment
resource "aws_iam_role_policy_attachment" "get_logs" {
  role       = aws_iam_role.lambda.name
  policy_arn = aws_iam_policy.logs.arn
}

# create a Function URL for Lambda 
# see the docs: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_function_url
resource "aws_lambda_function_url" "url" {
  function_name      = aws_lambda_function.lambda.function_name
  authorization_type = "NONE"

  cors {
    
    allow_credentials = true
    allow_origins     = ["*"]
    allow_methods     = ["GET", "POST", "PUT", "DELETE"]
    allow_headers     = ["*"]
    expose_headers    = ["keep-alive", "date"]
  }
}

# show the Function URL after creation
output "lambda_url" {
  value = aws_lambda_function_url.url.function_url
}



resource "aws_lambda_function_url" "delete_url" {
  function_name      = local.delete_note
  authorization_type = "NONE"

  cors {
    
    allow_credentials = true
    allow_origins     = ["*"]
    allow_methods     = ["DELETE"]
    allow_headers     = ["*"]
    expose_headers    = ["keep-alive", "date"]
  }
}

# show the Function URL after creation
output "delete-url" {
  value = aws_lambda_function_url.delete_url.function_url
}

resource "aws_lambda_function_url" "get_url" {
  function_name      = local.get_note
  authorization_type = "NONE"

  cors {
    
    allow_credentials = true
    allow_origins     = ["*"]
    allow_methods     = ["GET"]
    allow_headers     = ["*"]
    expose_headers    = ["keep-alive", "date"]
  }
}

# show the Function URL after creation
output "get-url" {
  value = aws_lambda_function_url.get_url.function_url
}





resource "aws_dynamodb_table" "notes" {
  name         = "notes"
  billing_mode = "PROVISIONED"
# up to 8KB read per second (eventually consistent)
  read_capacity = 1
# up to 1KB per second
  write_capacity = 1

  range_key = "id"
  hash_key = "email"


  attribute {
    name = "email"
    type = "S"
  }

# the hash_key data type is string
attribute {
    name = "id"
    type = "S"
  }
  
}


