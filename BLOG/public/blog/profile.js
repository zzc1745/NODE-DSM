$(document).ready(function(){
	$(".user-welcome").click(
		function(){
		if($(".user-info").css("display")=="none"){
			$(".user-info").fadeIn(500);
		}else {
			$(".user-info").fadeOut(500);
		}
	});
});
