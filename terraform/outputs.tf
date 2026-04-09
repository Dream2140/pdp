output "staging_url" {
  description = "Staging application URL"
  value       = "https://${fly_app.staging.name}.fly.dev"
}

output "production_url" {
  description = "Production application URL"
  value       = "https://${fly_app.production.name}.fly.dev"
}
