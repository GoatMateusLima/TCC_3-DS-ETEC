<?php

function getCnpjData($cnpj) {
    
    $cnpj = preg_replace('/[^0-9]/', '', $cnpj);

    
    $url = "https://brasilapi.com.br/api/cnpj/v1/$cnpj";

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10); // timeout 10s
    $response = curl_exec($ch);
    $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

  
    if ($httpcode == 200) {
        return json_decode($response, true); // retorna array associativo
    } else {
        return false; // falha na requisição
    }
}
?>
