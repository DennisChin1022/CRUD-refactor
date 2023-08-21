let search = $("#livesearch")

function showResults(str){
  if(str.length===0){
    search.addClass("hide");
  }else{
    search.removeClass("hide");
  }
}

$.ajax({
    url:"/customers",
    contentType:"application/json",
    method:"POST",
      data: JSON.stringify({query: str}),
      success: function(result) {
        search.html(result.response);
      }
  })