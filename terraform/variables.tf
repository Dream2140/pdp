variable "fly_api_token" {
  description = "Fly.io API token"
  type        = string
  sensitive   = true
}

variable "fly_org" {
  description = "Fly.io organization slug"
  type        = string
  default     = "personal"
}

variable "region" {
  description = "Fly.io deployment region"
  type        = string
  default     = "waw"
}

variable "staging_app_name" {
  description = "Name of the staging application"
  type        = string
  default     = "pdp-news-staging"
}

variable "production_app_name" {
  description = "Name of the production application"
  type        = string
  default     = "pdp-news-prod"
}

variable "docker_image" {
  description = "Docker image to deploy"
  type        = string
  default     = "ghcr.io/dream2140/pdp:main"
}
