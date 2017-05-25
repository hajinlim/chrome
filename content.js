document.documentElement.style.height = '100%';
document.body.style.height = '100%';
document.documentElement.style.width = '100%';
document.body.style.width = '100%';
var translateUrl = "https://www.googleapis.com/language/translate/v2?key=AIzaSyD4rLhLb3ZmwjLJDt-njNqFYP30eHeaBTQ&target=en&q=";
var watsonUrl = "https://access.alchemyapi.com/calls/html/HTMLGetCombinedData";
var alchemyApiKey = "e6f3d1baaf1156ab096a87fc41ae8d306ece2665";

// Replace 'unnamed' with 'your_name'
var myName = 'unnamed';

$(document).ready(function(){
  $(document).on("mouseover", ".userContent", function() {
    var position = $(this).offset();
    var width = $(this).width();
    //var str = $(this).html();
    var str = $(this).text();
    var content = str.replace(/[&\\#,+$~%*{}]/g, '');
    var height = $(this).height();
    console.log("CONT" + content);

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
        //console.log(data);
        var language = data["language"];
        if (language != "english" && language!=null) {
          //console.log("not english");
          addHoverBox();
          createButton();
          clickButton();

        }
        else{
          //console.log("english");
        }
      });
    }


    detectLanguage(content);

    function clickButton(){
      $(".btn-class").click(function(){
        //console.log('clicked');
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
        var translatedText = data.data.translations[0].translatedText;

      translatedText = translatedText.replace(/[&\\#,+$~%*{}]/g, ' ');
      translatedText = translatedText.replace("See Translation", "");
      translatedText = translatedText.replace("See More", "");
      translatedText = translatedText.replace("quot;", '"');
      translatedText = translatedText.replace("quot;", '"');


          $("#translation-box").html("<br> <br><h2 style='color: white;'> Translation: </h2> <div id='white-box'> " + translatedText + "</div><br>");



          $("#white-box").css('background-color', 'white');
          $("#white-box").css('height', 'auto');
          $("#white-box").css('padding', '10px');
          $("#white-box").css('width', 'auto');

        runEmotionAnalysis(translatedText);
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

    function runEmotionAnalysis(transText) {
      $.post(watsonUrl, {
        html: transText,
        apikey: alchemyApiKey,
        outputMode: "json",
        extract: "doc-emotion, doc-sentiment"

      }, function (data) {
        console.log(data);
        if (data["status"] == "OK") {

            //run sentiment-analysis
            //$("#translation-box").append("<h2>Sentiment Analysis </h2>");
            $("#translation-box").append("<br><h2 style='color: white;'> Sentiment Analysis: </h2><div id='white-box3'></div> <br>");
            $("#white-box3").css('background-color', 'white');
            $("#white-box3").css('height', 'auto');
            $("#white-box3").css('padding', '10px');
            $("#white-box3").css('width', 'auto');

            var sentimentType = data["docSentiment"]["type"];
            var sentimentScore = data["docSentiment"]["score"];
            // $("#translation-box").append("<p>Type: " + sentimentType + "<br>");
            // $("#translation-box").append("<p>Score: " + sentimentScore + "<br><br>");
            $("#white-box3").append("<p>Type: " + sentimentType + "<br>");
            $("#white-box3").append("<p>Score: " + sentimentScore + "<br><br>");
            drawSentAnalysisBars(sentimentScore);

            //run emotion analysis
          var count = 5; //num. of emotions
          var emotions = ["anger", "disgust", "fear", "joy", "sadness"];
          //colors: red, green, purple, orange, blue
          var barColors = ["#E73737", "#1D884B", "#7B44AF", "#FF871C", "#1D64C4"];
          var lefts = ["0", "50", "100", "150", "200"];
          var list = [0, 1, 2, 3, 4];
          var barWidth = $("#translation-box").width() * (.5);

            $("#translation-box").append("<br><h2 style='color: white;'> Emotion Analysis: </h2>");
            $("#translation-box").append("<div id='white-box2'></div> <br>");
            $("#white-box2").css('background-color', 'white');
            $("#white-box2").css('height', 'auto');
            $("#white-box2").css('padding', '10px');
            //$("#white-box2").css('padding-bottom', barWidth + "px");

            $("#white-box2").css('width', 'auto');

          for (var i = 0; i < count; i++) {
            var name = "rect" + i;
            var emotion = emotions[i];
            var barColor = barColors[i];
            var leftPos = lefts[i];
            var emotionPercentage = data["docEmotions"][emotion];
            var roundedEmotionPercentage = Math.round(emotionPercentage * 100);

            var barHeight;
            if ((barWidth * emotionPercentage) > 5) {
              barHeight = barWidth * emotionPercentage;
            }
            else {
              barHeight = 5;
            }

            $("#white-box2").append("<div class='rect'style='margin-left: 25px;border-radius: 5px;position:absolute;bottom:210px;left:" + leftPos + "px; height:" + barHeight + "px;padding:5px; border:0px solid#000;line-height: " + barHeight + "px; background-color:" + barColor + ";color:white;display:inline-block;vertical-align: middle; '>" + roundedEmotionPercentage + " %</div>");
            $("#white-box2").css('background-color', 'white');
            $("#white-box2").css('height', '150px');
            $("#white-box2").css('padding', '10px');
            /*
             $("#translation-box").append("<div class='rect' id= " + name + "; style='text-align: center; font-weight: bold;color:white;'>" + roundedEmotionPercentage +" %</div>");
             console.log(name);
             $(".rect").css("margin-left", "25px");
             $(".rect").css("position", "absolute");
             $(".rect").css("bottom", "240px");
             $(".rect").css("border", "0px solid#000");
             $(".rect").css("display", "inline-block");

             $("#" + name).css("left", leftPos + "px");
             $("#" + name).css("background-color", barColor);

             //if height is big enough to hold text (5 px)
             if ((barWidth*emotionPercentage) > 5){
             $("#" + name).css("height", (barWidth*emotionPercentage) + "px");
             }
             else{
             $("#" + name).css("height", "5px");
             }

             */
          }
          for (var i = 0; i < count; i++) {
            var emotion = emotions[i];
            var imageUrl = chrome.extension.getURL('/img/' + emotion + '.png');
            var emotionImage = document.createElement('img');
            emotionImage.src = imageUrl;
            $(emotionImage).css("height", "45px");
            $(emotionImage).css("display", "inline");
            $(emotionImage).css("margin", "1px");
            $("#white-box2").append(emotionImage);
          }



          //$("#white-box3").append("<p>Type: " + sentimentType + "<br>");
          //$("#white-box3").append("<p>Score: " + sentimentScore + "<br><br>");

          drawSentAnalysisBars(sentimentScore);

          // Log request information to the nodejs server.
          var logBlob = {
              time: Date.now(),
              docEmotions: data.docEmotions,
              docSentiment: data.docSentiment,
              docTranslation: transText,
              originalLanguage: 'TODO'
          };

            var payLoad = {
                name: myName,
                logBlob: logBlob
            };

            chrome.runtime.sendMessage(payLoad, function(response) {
                console.log(response);
            });
        }
        //if error message
        else {
          $("#translation-box").append("Analysis cannot be completed. Please check your internet connection or reload the page.");

        }
      });

    }

    function drawSentAnalysisBars(score){
        $("#white-box3").append("<div id='sent-bar-wrapper'> <div class='sent-bar' id='neg'>negative</div><div class='sent-bar' id='pos'>positive</div></div>");
        $("#white-box3").append("<div id='sent-arrow'></div>");


      $(".sent-bar").css("height", "20px");
      $(".sent-bar").css("width", "100px");
      $(".sent-bar").css("display", "inline-block");
      $(".sent-bar").css("text-align", "center");
      $(".sent-bar").css("font-weight", "bold");
      $(".sent-bar").css("padding", "2px");

      $("#sent-bar-wrapper").css("text-align", "center");


      $("#neg").css("background-color", "#EB5757");
      $("#neg").css("color", "white");
      $("#pos").css("background-color", "#6FCF97");
      $("#pos").css("color", "white");

      var sentBarWidth = $(".sent-bar").width();
      var arrowLeft = $("#neg").position().left;
      if (score < 0){
          arrowLeft += (1 - score*(-1))*sentBarWidth;
      }
      else if (score == null){
        //minus 6 to account for padding and spacing
        arrowLeft += sentBarWidth - 6;
      }
      else {
        arrowLeft += sentBarWidth + (score*sentBarWidth);
      }
      $("#sent-arrow").css("width", "0");
      $("#sent-arrow").css("height", "0");
      $("#sent-arrow").css("border-right", "10px solid transparent");
      $("#sent-arrow").css("border-left", "10px solid transparent");
      $("#sent-arrow").css("border-top", "20px solid black");
      $("#sent-arrow").css("position", "absolute");
      $("#sent-arrow").css("top", "260px");
      $("#sent-arrow").css("left", arrowLeft + "px");
      $("#white-box3").append("</div>");
      $("#white-box3").css('background-color', 'white');
      $("#white-box3").css('height', 'auto');
      $("#white-box3").css('padding', '20px');
      $("#white-box3").css('padding-top', '40px');


    }
  });

});

