<?php
require_once 'api/connection.php';

$cnpj = "19131243000197"; // exemplo de ONG válida
$data = getCnpjData($cnpj);

if($data) {
    echo "<pre>";
    print_r($data); // mostra todos os dados retornados da API
    echo "</pre>";
} else {
    echo "CNPJ não encontrado ou erro na API";
}
?>