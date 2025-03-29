variable "CI_REGISTRY_IMAGE" {
  validation {
    condition = CI_REGISTRY_IMAGE != ""
    error_message = "The variable 'CI_REGISTRY_IMAGE' must not be empty."
  }
}
variable "Z2_CI_NPMRC_FILE" {
  default = "docker/.npmrc"
  description = <<-EOT
  Absolute or relative path to .npmrc file on where build command gets executed.
  This is optional according to Dockerfile.
  EOT
}

group "default" {
  targets = ["default"]
}

target "_common" {
  context = "."
  dockerfile = "docker/Dockerfile"
  secret = ["type=file,id=npmrc,src=${Z2_CI_NPMRC_FILE}"]
}

target "default" {
  inherits = ["_common"]
  output = ["type=registry,name=${CI_REGISTRY_IMAGE}:latest,compression=zstd"]
}

target "mr" {
  inherits = ["_common"]
  output = ["type=cacheonly"]
}
