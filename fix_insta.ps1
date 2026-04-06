$pattern = '(?s)<a href="#"\s*>\s*<i[^>]*class="[^"]*fa-instagram[^"]*"[^>]*>\s*</i>\s*</a>'
$replacement = '<a href="https://www.instagram.com/kodava_tug_of_war_academy/"><i class="fa-brands fa-instagram"></i></a>'

Get-ChildItem -Recurse -Filter *.html | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    $content = $content -replace $pattern, $replacement
    Set-Content $_.FullName $content
}
Write-Output "Instagram links updated across all HTML files."
