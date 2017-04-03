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
    //console.log("STR " + str);
    console.log("CONT" + content);

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
      $("body").append("<div id='translation-box' style='background-color: #EDF0F5; position:absolute; width:20%; height:auto;'></div>");
      $("#translation-box").css("left", (position.left + width) + "px");
      $("#translation-box").css("top", position.top + "px");
      $("#translation-box").css("padding", "20px");
      $("#translation-box").css("z-index", "300");
      $("#translation-box").css("border-radius", "5px");
    }

    function translateText() {
      $.get(translateUrl + content, function (data) {
        var translatedText = data.data.translations[0].translatedText;
        $("#translation-box").html("<br> <br> <h2> Translation: </h2>" + "<div id='white-box'>" + translatedText + "</div> <br> <br>");
          $("#white-box").css('background-color', 'white');
          $("#white-box").css('height', 'auto');

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
                  //var count = data["entities"].length();
                  var lefts = ["50", "100", "placeholder", "150", "200"];
                  var list = [0, 1, 2, 3];
                  $("#translation-box").append("<h2> Entity Analysis: </h2>");
                  var count = res.response["entities"].length;

                  for (var i = 0; i < count; i++) {
                      var entity = res.response["entities"][i];
                      var analysis = "Text: " + entity["matchedText"] + "<br>Type: " + entity["type"] + "<br>Relevance: " + entity["relevanceScore"] + "<br>WikiLink: <a href=" + entity["wikiLink"] + " target= 'blank'>" + entity["wikiLink"] + "</a><br>";
                      $("#translation-box").append(analysis);
                  }
              },
              error: function (err) {
                  console.log(err);
              }
          });
      }

  });

});
