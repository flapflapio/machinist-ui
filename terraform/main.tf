terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.27"
    }
  }
  required_version = ">= 0.14.9"
}

provider "aws" {
  profile = "default"
  region  = "us-east-1"
}

variable "GITHUB_ACCESS_TOKEN" {
  type = string
}

resource "aws_amplify_app" "machinist-ui" {
  name       = "machinist-ui"
  repository = "https://github.com/flapflapio/machinist-ui"

  # ! Insert your access token here
  access_token = var.GITHUB_ACCESS_TOKEN

  build_spec = <<-EOT
    version: 0.1
    frontend:
      phases:
        preBuild:
          commands:
            - yarn install
        build:
          commands:
            - yarn run build
      artifacts:
        baseDirectory: build
        files:
          - '**/*'
      cache:
        paths:
          - node_modules/**/*
  EOT

  custom_rule {
    source = "/<*>"
    status = "404"
    target = "/index.html"
  }

  environment_variables = {
    "ENV" = "test"
  }

  platform = "WEB"

  description = <<-EOT
    Machinist web app
  EOT
}

resource "aws_amplify_branch" "main" {
  app_id      = aws_amplify_app.machinist-ui.id
  branch_name = "main"
  framework   = "React"
  stage       = "PRODUCTION"
}
