document.documentElement.style.height = '100%';
document.body.style.height = '100%';
document.documentElement.style.width = '100%';
document.body.style.width = '100%';
var translateUrl = "https://www.googleapis.com/language/translate/v2?key=AIzaSyD4rLhLb3ZmwjLJDt-njNqFYP30eHeaBTQ&target=en&q=";
var watsonUrl = "https://access.alchemyapi.com/calls/html/HTMLGetCombinedData";
var alchemyApiKey = "ebdc494fb03a3ef1a8e1c43716e8fe2aea9b7d95";

$(document).ready(function(){
  $(document).on("mouseover", ".userContent", function() {
    var position = $(this).offset();
    var width = $(this).width();
    var str = $(this).text();
    var content = str.replace(/[&\\#,+$~%*{}]/g, '');

    var height = $(this).height();


    var matchedWordsArray = [];
    var translatedText = "";

    function addHoverBox(){
      $("body").append("<div id='hover-box' style='margin: -5px; border-radius:5px;border-right:8px solid #3B5998; position:absolute; width:auto; height:auto;'></div>");

      $("#hover-box").css("left", position.left + "px");
      $("#hover-box").css("top", position.top + "px");
      $("#hover-box").css("width", width + "px");
      $("#hover-box").css("height", (height-30) + "px");
    }

    function createButton(){
      $("body").append("<button class='btn-class' style='position:absolute;border-radius:5px;'>Check</button>");
      $(".btn-class").css("left", (position.left + width) + "px");
      $(".btn-class").css("top", (position.top - 5) + "px");
      $(".btn-class").css("background-color", "#3B5998");
      $(".btn-class").css("color", "white");
      $(".btn-class").css("position", "absolute");
      $(".btn-class").css("border", "none");
      $(".btn-class").css("padding", "10px");
      $(".btn-class").css("font-weight", "bold");
      $(".btn-class").css("z-index", "301");

    }

   function detectLanguage(foreignText) {
      $.post(watsonUrl, {html: foreignText, apikey: alchemyApiKey, outputMode: "json"}, function (data) {
        var language = data["language"];
        if (language != "english" && language!=null) {
          addHoverBox();
          createButton();
          clickButton();
        }
      });
    }


    detectLanguage(content);

    function clickButton(){
      $(".btn-class").click(function(){
        addTranslationBox();
        translateText();
      });
    }
    function addTranslationBox(){
      $("body").append("<div id='translation-box' style='background-color: #1A99DB; position:absolute; width:20%; height:auto;'></div>");
      $("#translation-box").css("left", (position.left + width) + "px");
      $("#translation-box").css("top", position.top + "px");
      $("#translation-box").css("padding", "20px");
      $("#translation-box").css("z-index", "300");
      $("#translation-box").css("border-radius", "5px");
    }
    function translateText() {
      $.get(translateUrl + content, function (data) {
        translatedText = data.data.translations[0].translatedText;
        $("#translation-box").html("<br> <br> <h2 style='color: white;'> Translation: </h2>" + "<div id='white-box'></div> <br> <br>");
          $("#white-box").css('background-color', 'white');
          $("#white-box").css('height', 'auto');
          $("#white-box").css('padding', '10px');

          runEntityAnalysis(translatedText);

      });

    }
    //remove translation box when click outside of it
    $(document).mouseup(function (e) {
      var container = $("#translation-box");

      if (!container.is(e.target) // if the target of the click isn't the container...
          && container.has(e.target).length === 0) // ... nor a descendant of the container
      {
        container.remove();
      }
    });

      function runEntityAnalysis(transText) {
          $.ajax({
              url: "https://api.textrazor.com",
              type: "POST",
              headers: {
                  "X-TextRazor-Key": '5f23ec2822473b2a2d907728ff24d547ce1ea7be4ff56df732b613e6'
              },
              data: {
                  text: transText,
                  extractors: "entities",
              },
              success: function (res) {
                  console.log(res);
                  var lefts = ["50", "100", "placeholder", "150", "200"];
                  var list = [0, 1, 2, 3];
                  $("#translation-box").append("<h2 style='color: white;'> Entity Analysis: </h2>");
                  var count = res.response["entities"].length;
                  $("#translation-box").append("<div id='white-box2'>");
                  for (var i = 0; i < count; i++) {
                      var entity = res.response["entities"][i];
                      var relevanceScore = entity["relevanceScore"];
                      var matchedText = entity["matchedText"];
                      matchedWordsArray.push(matchedText);
                      var analysis = "Text: ";
                      analysis += matchedText;
                      analysis += "<br>Type: " + entity["type"] + "<br>WikiLink: <a href=" + entity["wikiLink"] + " target= 'blank'>" + entity["wikiLink"] + "</a><br>";
                      $("#white-box2").append(analysis);
                  }
                  console.log(matchedWordsArray);

                  //highlight words in translated text
                  //var text = translatedText.split(" ");
                  //console.log('text ' + text);
                  var newText = translatedText;
                  //for (var i=0; i<text.length; i++){
                  for (var i=0; i<matchedWordsArray.length; i++){
                      //if (matchedWordsArray.includes(text[i])){
                      if (translatedText.match(matchedWordsArray[i]) != null){
                      //    console.log('TRUE' + translatedText.match(matchedWordsArray[i]));
                          //change background color
                      //    $("#white-box").append(matchedWordsArray[i]);
                          var highlightStyle = "<mark style='background-color: #ffb3b3; opacity: " + .75 + "'>";
                          var highlighted = highlightStyle + matchedWordsArray[i] + "</mark>";
                          newText = newText.replace(matchedWordsArray[i], highlighted);
                          console.log('NEWTEXT' + newText);

                      }
                      else {
                          console.log('FALSE ARRAY ' + matchedWordsArray[i]);
                      }
                  }
                  $("#white-box").append(newText);

                  $("#white-box2").append("</div>");
                  $("#white-box2").css('background-color', 'white');
                  $("#white-box2").css('height', 'auto');
                  $("#white-box2").css('padding', '10px');
              },
              error: function (err) {
                  console.log(err);
              }
          });
      }

  });

});
