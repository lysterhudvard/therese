<?php
/**
 * PHP Contact Form Handler for Hostinger Deployments
 * Sends emails using the Resend API.
 * 
 * To configure your Resend API Key:
 * Option A (Recommended): Add SetEnv RESEND_API_KEY "your-key" to your .htaccess file.
 * Option B: Add RESEND_API_KEY="your-key" to a .env file in the root directory.
 * Option C: Set the environment variable in your Hostinger Control Panel.
 */

// Allow CORS
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Handle preflight OPTIONS requests
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["error" => "Method Not Allowed"]);
    exit;
}

// Get raw JSON post data
$input = file_get_contents("php://input");
$data = json_decode($input, true);

$name = isset($data["name"]) ? trim($data["name"]) : "";
$email = isset($data["email"]) ? trim($data["email"]) : "";
$msg = isset($data["msg"]) ? trim($data["msg"]) : "";

if (empty($name) || empty($email) || empty($msg)) {
    http_response_code(400);
    echo json_encode(["error" => "Missing required fields: name, email, msg"]);
    exit;
}

// Retrieve RESEND_API_KEY from environment or server variables
$resendApiKey = getenv("RESEND_API_KEY");
if (!$resendApiKey && isset($_SERVER["RESEND_API_KEY"])) {
    $resendApiKey = $_SERVER["RESEND_API_KEY"];
}
if (!$resendApiKey && isset($_ENV["RESEND_API_KEY"])) {
    $resendApiKey = $_ENV["RESEND_API_KEY"];
}

// Fallback: Parse local .env file in parent directory or current directory
if (empty($resendApiKey)) {
    $envPaths = [__DIR__ . "/.env", __DIR__ . "/../.env", __DIR__ . "/../../.env"];
    foreach ($envPaths as $path) {
        if (file_exists($path)) {
            $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
            foreach ($lines as $line) {
                if (strpos(trim($line), '#') === 0) continue;
                if (strpos($line, '=') !== false) {
                    list($key, $value) = explode('=', $line, 2);
                    if (trim($key) === "RESEND_API_KEY") {
                        $resendApiKey = trim(str_replace(['"', "'"], '', $value));
                        break 2;
                    }
                }
            }
        }
    }
}

if (empty($resendApiKey)) {
    http_response_code(500);
    echo json_encode([
        "error" => "Email configuration error: RESEND_API_KEY environment variable is not set.",
        "solution" => "Please add SetEnv RESEND_API_KEY 'your-key' to your .htaccess file, or create a .env file."
    ]);
    exit;
}

// Get receiver & sender emails (with defaults matching Netlify configuration)
$receiverEmail = getenv("RECEIVER_EMAIL") ?: (isset($_SERVER["RECEIVER_EMAIL"]) ? $_SERVER["RECEIVER_EMAIL"] : "theresejarvheden@gmail.com");
$senderEmail = getenv("SENDER_EMAIL") ?: (isset($_SERVER["SENDER_EMAIL"]) ? $_SERVER["SENDER_EMAIL"] : "info@theresejarvheden.se");

// Prepare Resend API request payload
$postData = [
    "from" => "Therese Järvheden Hemsida <" . $senderEmail . ">",
    "to" => [$receiverEmail],
    "reply_to" => $email,
    "subject" => "Meddelande från " . $name . " via theresejarvheden.se",
    "html" => '
      <div style="font-family: sans-serif; padding: 25px; color: #1c1c1c; max-width: 600px; border: 1px solid #e0dcd1; border-radius: 4px; background-color: #fdfcf7;">
        <h2 style="color: #D88C5A; font-weight: 500; border-bottom: 1px solid #e0dcd1; padding-bottom: 12px; margin-top: 0; font-size: 20px; letter-spacing: 0.05em; text-transform: uppercase;">Nytt meddelande från hemsidan</h2>
        <div style="margin-top: 20px; font-size: 14px; line-height: 1.6;">
          <p style="margin: 6px 0;"><strong>Namn:</strong> ' . htmlspecialchars($name) . '</p>
          <p style="margin: 6px 0;"><strong>E-post:</strong> <a href="mailto:' . htmlspecialchars($email) . '" style="color: #D88C5A; text-decoration: none; border-bottom: 1px dotted #D88C5A;">' . htmlspecialchars($email) . '</a></p>
          <div style="margin-top: 24px; padding: 18px; background-color: #f5f3e9; border-left: 3px solid #D88C5A; font-style: italic; white-space: pre-wrap; color: #2c2c2c;">"' . htmlspecialchars($msg) . '"</div>
        </div>
        <hr style="border: 0; border-top: 1px solid #e0dcd1; margin-top: 30px;" />
        <p style="font-size: 11px; color: #8c887d; font-family: monospace; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0;">Detta mejl skickades från kontaktformuläret på theresejarvheden.se.</p>
      </div>
    '
];

$ch = curl_init("https://api.resend.com/emails");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($postData));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Content-Type: application/json",
    "Authorization: Bearer " . $resendApiKey
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode >= 200 && $httpCode < 300) {
    http_response_code(200);
    echo json_encode(["success" => true]);
} else {
    http_response_code($httpCode);
    $resDecoded = json_decode($response, true);
    echo json_encode([
        "error" => "Failed to send email via Resend API",
        "details" => $resDecoded ? $resDecoded : $response
    ]);
}
?>
