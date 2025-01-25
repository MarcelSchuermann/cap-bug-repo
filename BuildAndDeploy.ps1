# Exit immediately if a command exits with a non-zero status
$ErrorActionPreference = "Stop"

# # Step 0: add android platform
#npx @capacitor/cli add android

# # Step 1: (Re)install node_modules
# Write-Host "Installing/updating npm dependencies..." -ForegroundColor Cyan
# npm install

# # Step 2: Build the web assets
# Write-Host "Building web assets..." -ForegroundColor Cyan
# # Replace 'build' with your actual build script if different
# npm run build

# Step 3: Synchronize Capacitor with Android platform
Write-Host "Synchronizing Capacitor with Android platform..." -ForegroundColor Cyan
npx @capacitor/cli sync android

# Step 4: Open the Android project in Android Studio
Write-Host "Opening Android project in Android Studio..." -ForegroundColor Cyan
npx @capacitor/cli open android