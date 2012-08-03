
//codes and names of available languages for translation by microsoft api
var availableLanguagesCodes = ''; 
var availableLanguagesNames = '';

//following 2 objects are for easy conversion between code to language and language to code
var codeToLanguage = {};
var languageToCode = {};

//callAPI creates script element and appends it to head
function callAPI(api){
	var s = document.createElement("script");
	s.type = 'text/javascript';
	s.src = api;
	document.getElementsByTagName("head")[0].appendChild(s);
}


function onTranslate(response){
	document.getElementById("destTextArea").value = response;
}

//translate function takes source text and translates it the response from microsoft api is used in onTranslate function
function translate(){
	languageFrom = languageToCode[document.getElementById('fromLang').value];
	languageTo = languageToCode[document.getElementById('toLanguageSelect').value];
	text = document.getElementById("srcTextArea").value;
	api = "http://api.microsofttranslator.com/V2/Ajax.svc/Translate?oncomplete=onTranslate&appId=86B37AB482F841F7A33D2AB16430EF7C46E8775F&from=" + languageFrom + "&to=" + languageTo + "&text=" + text;
	callAPI(api);
}

function onDetect(response){
	if(document.getElementById("srcTextArea").value != ''){
		if(codeToLanguage[response] == undefined){
			document.getElementById("fromLang").value = 'not available';
			document.getElementById("languageAvailableText").innerHTML = 'See the dropdown above for a list of languages available for translation';
			document.getElementById("destTextArea").value = '';
		}
		else{
			document.getElementById("fromLang").value = codeToLanguage[response];
			document.getElementById("languageAvailableText").innerHTML = '  ';
		}
	}
	if( document.getElementById('fromLang').value != '' && document.getElementById('fromLang').value != 'not available')
		translate();
}

//to detect the language typed by the user
function detect() {
	var text = document.getElementById("srcTextArea").value;
	api = "http://api.microsofttranslator.com/V2/Ajax.svc/Detect?oncomplete=onDetect&appId=86B37AB482F841F7A33D2AB16430EF7C46E8775F&text=" + text;
	callAPI(api);
}

//populateToDropdown populates the to-language dropdown with the languages obtained from microsoft api
function populateToDropdown() {
	selectbox = document.getElementById('toLanguageSelect');
	for(var count=0; count<availableLanguagesCodes.length; count++) {
		var optn = document.createElement("OPTION");
		optn.text = availableLanguagesNames[count];
		optn.value = availableLanguagesNames[count];
		selectbox.appendChild(optn);
		if(availableLanguagesCodes[count] == 'en')
			optn.selected = true;
		codeToLanguage[availableLanguagesCodes[count]] = availableLanguagesNames[count];
		languageToCode[availableLanguagesNames[count]] = availableLanguagesCodes[count]
	}
}

function onGetLanguageNames(response){
	availableLanguagesNames = response;
	populateToDropdown();
}

//to get the readable language names after we have the language codes
function getLanguageNames(languageCodes){
	var localeCode = 'en';
	var codes = "[";
	for (var count = 0; count < languageCodes.length; count++) {
		codes += "\"" + languageCodes[count] + "\"";
		if (count != languageCodes.length - 1)
			codes += ", ";
	}
	codes += "]";
	api = "http://api.microsofttranslator.com/V2/Ajax.svc/GetLanguageNames" 
	+ "?oncomplete=onGetLanguageNames&appId=86B37AB482F841F7A33D2AB16430EF7C46E8775F"
	+ "&locale=" + localeCode
	+ "&languageCodes=" + codes;
	callAPI(api);
}

function onGetLanguagesForTranslate(response){
	availableLanguagesCodes = response;
	getLanguageNames(availableLanguagesCodes);
}

//to get available languages for translation from microsoft api
function getLanguagesForTranslate(){
	api = "http://api.microsofttranslator.com/V2/Ajax.svc/GetLanguagesForTranslate?oncomplete=onGetLanguagesForTranslate&appId=86B37AB482F841F7A33D2AB16430EF7C46E8775F";
	callAPI(api);
}

window.onload = getLanguagesForTranslate;