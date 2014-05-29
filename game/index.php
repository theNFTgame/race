<?php
    $agent = strtolower($_SERVER['HTTP_USER_AGENT']);
	if (strpos($agent, 'tencenttraveler') !== false){
		echo '点击 “查看原网页”,即可开始游戏。';
		exit;
	}

	if(strpos($agent, 'micromessenger') === false && strpos($agent, 'windows phone') === false )
	{
		echo "请在微信中打开本网页进行游戏。";
		exit;
	}

	include(__dir__.'/../racegame/lite.php');
	$_userCurrent = getWxUser();
	if(!isset($_userCurrent)){
	    header(sprintf("Location:http://%s/racegame/wx_login.php?brand=%s"
	    				,$_SERVER['HTTP_HOST']
	    				,APP_WX_BRAND
	    				));
	    exit();
	}else{
	    // var_export($_userCurrent);
	    include 'index.html';
	}