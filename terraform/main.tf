terraform {
  required_providers {
    fly = {
      source  = "fly-apps/fly"
      version = "~> 0.1"
    }
  }
}

provider "fly" {
  fly_api_token = var.fly_api_token
}

# Staging app
resource "fly_app" "staging" {
  name = var.staging_app_name
  org  = var.fly_org
}

resource "fly_machine" "staging" {
  app    = fly_app.staging.name
  region = var.region
  name   = "${var.staging_app_name}-machine"

  image = var.docker_image

  services = [
    {
      ports = [
        {
          port     = 443
          handlers = ["tls", "http"]
        },
        {
          port     = 80
          handlers = ["http"]
        }
      ]
      protocol      = "tcp"
      internal_port = 3000
    }
  ]

  cpus     = 1
  memorymb = 256
}

# Production app
resource "fly_app" "production" {
  name = var.production_app_name
  org  = var.fly_org
}

resource "fly_machine" "production" {
  app    = fly_app.production.name
  region = var.region
  name   = "${var.production_app_name}-machine"

  image = var.docker_image

  services = [
    {
      ports = [
        {
          port     = 443
          handlers = ["tls", "http"]
        },
        {
          port     = 80
          handlers = ["http"]
        }
      ]
      protocol      = "tcp"
      internal_port = 3000
    }
  ]

  cpus     = 1
  memorymb = 256
}
