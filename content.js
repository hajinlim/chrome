document.documentElement.style.height = '100%';
document.body.style.height = '100%';
document.documentElement.style.width = '100%';
document.body.style.width = '100%';
var translateUrl = "https://www.googleapis.com/language/translate/v2?key=AIzaSyD4rLhLb3ZmwjLJDt-njNqFYP30eHeaBTQ&target=en&q=";
var watsonUrl = "https://access.alchemyapi.com/calls/html/HTMLGetCombinedData";
var alchemyApiKey = "2559328133acc4a3e8825bc7afe60edcd1d0beeb";

$(document).ready(function(){
  $(document).on("mouseover", ".userContent", function() {
    var position = $(this).offset();
    var width = $(this).width();
    var content = $(this).find("p").first().html();
    var height = $(this).height();

    function addHoverBox(){
      $("body").append("<div id='hover-box' style='background-color: blue; opacity: 0.2; position:absolute; width:auto; height:auto;'></div>");

      $("#hover-box").css("left", position.left + "px");
      $("#hover-box").css("top", position.top + "px");
      $("#hover-box").css("width", width + "px");
      $("#hover-box").css("height", height + "px");
    }

    function createButton(){
      $("body").append("<button class='btn-class' style='position:absolute;'>Check</button>");
      $(".btn-class").css("left", (position.left + width) + "px");
      $(".btn-class").css("top", position.top + "px");
      $(".btn-class").css("z-index", 100000);
      $(".btn-class").css("background-color", "#169BD5");
      $(".btn-class").css("color", "white");
      $(".btn-class").css("position", "absolute");
      $(".btn-class").css("border", "none");
      $(".btn-class").css("padding", "10px");
      $(".btn-class").css("font-weight", "bold");

    }

   function detectLanguage(foreignText) {
      $.post(watsonUrl, {html: foreignText, apikey: alchemyApiKey, outputMode: "json"}, function (data) {
        console.log(data);
        var language = data["language"];
        if (language != "english" && language!=null) {
          console.log("not english");
          addHoverBox();
          createButton();
          clickButton();

        }
        else{
          console.log("english");
        }
      });
    }

    detectLanguage(content);

    function clickButton(){
      $(".btn-class").click(function(){
        console.log('clicked');
        addTranslationBox();
        translateText();
        //drawRect();
      });
    }
    function addTranslationBox(){
      $("body").append("<div id='translation-box' style='background-color: lightblue; position:absolute; width:auto; height:auto;'></div>");
      $("#translation-box").css("left", (position.left + width) + "px");
      $("#translation-box").css("top", position.top + "px");
      $("#translation-box").css("z-index", 1000);
      $("#translation-box").css("padding", "20px");
    }

    function translateText() {
      $.get(translateUrl + content, function (data) {
        var translatedText = data.data.translations[0].translatedText;
        $("#translation-box").html("<br> <br> <h2> Translation: </h2>" + translatedText + "<br> <br>");
        runEntityAnalysis(translatedText);
      });

    }

    function runEntityAnalysis(transText) {
      $.post(watsonUrl, {
        html: transText,
        apikey: alchemyApiKey,
        outputMode: "json",
        extract: "entity"
      }, function (data) {
        console.log(data);
        //var count = data["entities"].length();
        var lefts = ["50","100","placeholder","150","200"];
        var list = [0,1,2,3];
        $("#translation-box").append("<h2> Entity Analysis: </h2>");
        $("#translation-box").append("<br>");
       // for (var i = 0; i < count; i++) {
          //console.log(count);
          console.log(data);
          console.log(data["entities"]);
        var count = data["entities"].length;
        console.log(data["entities"][0]["text"]);
        for (var i=0; i<count; i++){
          var entity = data["entities"][i];
          var analysis = "Text: " + entity["text"] + "<br>Type: " + entity["type"] + "<br>";
          $("#translation-box").append(analysis);
        }
        console.log(data["entities"][0]["type"]);
        console.log(data["entities"][0]["relevance"]);
        console.log(data["entities"][0]["text"]);


        //  }



        //drawRect();
      });
    }

    function drawBars(emotionPercent){
      var barWidth = $("#translation-box").width();

      $("#translation-box").append("<div class='rect'style='height:" + (barWidth*emotionPercent) + "px;z-index: 10000000000; border:1px solid#000; background-color: blue;color:white;margin:10px;display:inline-block;'>" + emotionPercentage +"</div>");

    }
    function drawRect(percentage){
      //$("#translation-box").append("<div class='rect' style='position:absolute; width:100px;z-index: 1000000000000; border:1px solid#000; background-color: blue;color:white;'>Hi</div>");
      //document.getElementById('rect').innerHTML = data["docEmotions"][emotion];
      console.log('box');
    }
  });
});
