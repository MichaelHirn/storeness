<?php
if(isset($_GET))
{
	$data = $_GET;
	$to		= "michael-hirn@storeness.de, korbinian-hoeger@storeness.de";
	var_dump(mail($to, 'Neue Kontaktanfrage', $data['name']." (".$data['email'].") schreibt:".PHP_EOL."".$data['nachricht']));
}
