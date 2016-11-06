$(function() {
    if (('webkitSpeechRecognition' in window)) {
        
        var questionCount = 0;
        var correctCount = 0;
        var resetScreen = false 
        var final_transcript = '';
        var interim_transcript = '';
        var recognizing = true;
        var two_line = /\n\n/g;
        var one_line = /\n/g;
        var recognition = new webkitSpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = "en-AU";

        recognition.onstart = function() {
            recognizing = true;
            $(".mic-state").removeClass("off")
            $(".mic-state").addClass("on")
        };

        recognition.onend = function() {
            recognizing = false;
            $(".mic-state").addClass("off")
            $(".mic-state").removeClass("on")
        };

        recognition.onresult = function(event) {
            $(".try-again").hide()
            var interim_transcript = '';
            for (var i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    final_transcript += event.results[i][0].transcript;
                } else {
                    interim_transcript += event.results[i][0].transcript;
                }
            }

            if (final_transcript.length > 0) {
                console.log(final_transcript)
                var command = final_transcript.toLowerCase()
                checkCommand(command)
                final_transcript = ""
                interim_transcript = ""
            }
            else if (interim_transcript.length > 0) {
                console.log(interim_transcript)
            }
        };

        function checkCommand(command) {
          if (command.indexOf("skip") >= 0) {
            questionCount++
            changeQuestion()
          }
          else if (resetScreen && command.indexOf("reset") >= 0) {
            resetActivity()
          }
          else if (questionCount == 0) {
            if (command.indexOf("triangle") >= 0) {
              questionCount++
              correctCount++
              changeQuestion()
            }
            else {
              tryAgain()
            }
          }
          else if (questionCount == 1) {
            if (command.indexOf("square") >= 0) {
              questionCount++
              correctCount++
              changeQuestion()
            }
            else {
              tryAgain()
            }
          }
          else if (questionCount == 2) {
            if (command.indexOf("4") >= 0 || command.indexOf("four") >= 0 || command.indexOf("for") >= 0) {
              questionCount++
              correctCount++
              changeQuestion()
            }
            else {
              tryAgain()
            }
          }
        }

        function changeQuestion() {
          if ($(".question-wrapper").children().length == questionCount) {
            var feedback = "<p>You Got: " + correctCount + "/" + questionCount + " Questions Correct" + "</p><button>Reset</button>"
            $(".feedback-wrapper").html(feedback)
            $(".feedback-wrapper").show()
            $(".question-wrapper").hide()
            resetScreen = true
            $(".feedback-wrapper").find("button").on("click", function() {
              resetActivity()
            })
          }
          else {
            var current = $(".question-active")
            current.removeClass("question-active").addClass("question-hidden")
            current.next().removeClass("question-hidden").addClass("question-active")
          }
        }

        function resetActivity() {
          questionCount = 0
          correctCount = 0
          resetScreen = false
          $(".question-wrapper").children().each(function(i) {
            if (i == 0) {
              $(this).addClass("question-active").removeClass("question-hidden")
            }
            if (i == $(".question-wrapper").children().length - 1) {
              $(this).removeClass("question-active").addClass("question-hidden")
            }
          })
          $(".feedback-wrapper").hide()
          $(".question-wrapper").show()
        }

        $(".stop-mic").click(function() {
            recognition.stop()
            $(".start-mic").show()
            $(this).hide()
        })

        $(".start-mic").click(function() {
            recognition.start()
            $(".stop-mic").show()
            $(this).hide()
        })

        function tryAgain() {
          $(".try-again").show()
        }

        recognition.start();
    }
})
