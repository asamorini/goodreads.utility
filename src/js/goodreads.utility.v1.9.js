//GOODREADS NEW FUNCTIONALITY
/*
Minify code:
	https://closure-compiler.appspot.com/home
		poi a mano aggiungere come prefisso

Save a Bookmarklet "Goodreads Samo Utility" with this javascript code
	https://en.wikipedia.org/wiki/Bookmarklet
	https://betterexplained.com/articles/how-to-make-a-bookmarklet-for-your-web-application/
		1) publish on Github the js file
					https://asamorini.github.io/goodreads.utility/dist/goodreads.utility.min.js
		2) replace in this script GOODREADS_UTILITY_JS with the js file url
				javascript:(function(){var s=document.createElement('SCRIPT');s.type='text/javascript';s.src='GOODREADS_UTILITY_JS';document.getElementsByTagName('head')[0].appendChild(s);})();
			the result can be
				javascript:(function(){var s=document.createElement('SCRIPT');s.type='text/javascript';s.src='https://asamorini.github.io/goodreads.utility/dist/goodreads.utility.min.js';document.getElementsByTagName('head')[0].appendChild(s);})();
		3) add previous script as URL of a new bookmark of the browser
*/
var samoGoodreadsUtility=samoGoodreadsUtility || {'lang':'ita'};	/*possible values:
																			'lang':			'ita',		-> language
																			'excludeShelves':{			-> excludes shelves from "Shelves viewer"
																				'read':{						-> from "Read" shelf analyzed
																					's':	'p_',						-> starts
																					'c':	'',							-> contains
																					'e':	''							-> ends
																				},
																				'to-read':{						-> from "Want to Read" shelf analyzed
																					's':	'',							-> starts
																					'c':	'',							-> contains
																					'e':	''							-> ends
																				}
																			},
																			'shelvesNames':''			-> replace shelves names from "Shelves viewer"
																												ex: "toread-|,toread_|,_|,-|"
																													every replacing rules
																														separated by ","
																														composed by 2 parts, separated by "|":
																															1) searching text
																															2) [optional] replacing text
																	*/
(function($){
	//-----------------   private methods   -----------------
	var _logPrefix='GOODREADS UTILITY ',
		_VERSION='1.9',

		_bDebug=false,
		_bDebugConsole=null,

		_pageType='unknown',
		_PAGE_TYPE_BOOK='BOOK',
		_PAGE_TYPE_GOODREADS_CHOICE_AWARDS='GOODREADS CHOICE AWARDS',
		_PAGE_TYPE_GOODREADS_CHOICE_AWARDS_CATEGORY='GOODREADS CHOICE AWARDS CATEGORY',
		_PAGE_TYPE_AUTHOR='AUTHOR',
		_PAGE_TYPE_AUTHOR_BOOKS='AUTHOR BOOKS',
		_PAGE_TYPE_LIST='LISTOPIA',
		_PAGE_TYPE_LIST_USERVOTES='LISTOPIA USER VOTES',
		_PAGE_TYPE_RECOMMENDATIONS='RECOMMENDATIONS',
		_PAGE_TYPE_MYBOOKS='MY BOOKS',
		_PAGE_TYPE_FAVORITES_GENRES='FAVORITES GENRES',
		_PAGE_TYPE_FAVORITES_GENRES_SPECIFIC='FAVORITES GENRE SPECIFIC',

		_menuSamoButton,

		//languages
		_languageCod='',
		_languageDesc='',
		_languageButtonSpan='<span class="LANGUAGE_DESCRIPTION"></span>',
		_languages=[
			['eng','English'],
			['spa','Spanish'],
			['fre','French'],
			['ger','German'],
			['ita','Italian'],
			['','-------'],
			['abk','Abkhazian'],
			['ace','Achinese'],
			['ach','Acoli'],
			['ada','Adangme'],
			['ady','Adyghe; Adygei'],
			['aar','Afar'],
			['afh','Afrihili'],
			['afr','Afrikaans'],
			['afa','Afro-Asiatic (Other)'],
			['ain','Ainu'],
			['aka','Akan'],
			['akk','Akkadian'],
			['sqi','Albanian'],
			['ale','Aleut'],
			['alg','Algonquian languages'],
			['tut','Altaic (Other)'],
			['amh','Amharic'],
			['anp','Angika'],
			['apa','Apache languages'],
			['ara','Arabic'],
			['arg','Aragonese'],
			['arp','Arapaho'],
			['arw','Arawak'],
			['hye','Armenian'],
			['rup','Aromanian; Arumanian; Macedo-Romanian'],
			['art','Artificial (Other)'],
			['asm','Assamese'],
			['ast','Asturian; Bable; Leonese; Asturleonese'],
			['ath','Athapascan languages'],
			['aus','Australian languages'],
			['map','Austronesian (Other)'],
			['ava','Avaric'],
			['ave','Avestan'],
			['awa','Awadhi'],
			['aym','Aymara'],
			['aze','Azerbaijani'],
			['ban','Balinese'],
			['bat','Baltic (Other)'],
			['bal','Baluchi'],
			['bam','Bambara'],
			['bai','Bamileke languages'],
			['bad','Banda languages'],
			['bnt','Bantu (Other)'],
			['bas','Basa'],
			['bak','Bashkir'],
			['eus','Basque'],
			['btk','Batak languages'],
			['bej','Beja; Bedawiyet'],
			['bel','Belarusian'],
			['bem','Bemba'],
			['ben','Bengali'],
			['ber','Berber (Other)'],
			['bho','Bhojpuri'],
			['bih','Bihari'],
			['bik','Bikol'],
			['bin','Bini; Edo'],
			['bis','Bislama'],
			['byn','Blin; Bilin'],
			['zbl','Blissymbols; Blissymbolics; Bliss'],
			['nob','Bokmål, Norwegian; Norwegian Bokmål'],
			['bos','Bosnian'],
			['bra','Braj'],
			['bre','Breton'],
			['bug','Buginese'],
			['bul','Bulgarian'],
			['bua','Buriat'],
			['mya','Burmese'],
			['cad','Caddo'],
			['cat','Catalan; Valencian'],
			['cau','Caucasian (Other)'],
			['ceb','Cebuano'],
			['cel','Celtic (Other)'],
			['cai','Central American Indian (Other)'],
			['khm','Central Khmer'],
			['chg','Chagatai'],
			['cmc','Chamic languages'],
			['cha','Chamorro'],
			['che','Chechen'],
			['chr','Cherokee'],
			['chy','Cheyenne'],
			['chb','Chibcha'],
			['nya','Chichewa; Chewa; Nyanja'],
			['zho','Chinese'],
			['chn','Chinook jargon'],
			['chp','Chipewyan; Dene Suline'],
			['cho','Choctaw'],
			['chu','Church Slavic; Old Slavonic; Old Bulgarian;'],
			['chk','Chuukese'],
			['chv','Chuvash'],
			['nwc','Classical Newari; Old Newari; Classical Nepal Bhasa'],
			['syc','Classical Syriac'],
			['cop','Coptic'],
			['cor','Cornish'],
			['cos','Corsican'],
			['cre','Cree'],
			['mus','Creek'],
			['crp','Creoles and pidgins (Other)'],
			['cpe','Creoles and pidgins, English based (Other)'],
			['cpf','Creoles and pidgins, French-based (Other)'],
			['cpp','Creoles and pidgins, Portuguese-based (Other)'],
			['crh','Crimean Tatar; Crimean Turkish'],
			['scr','Croatian'],
			['cus','Cushitic (Other)'],
			['cze','Czech'],
			['dak','Dakota'],
			['dan','Danish'],
			['dar','Dargwa'],
			['del','Delaware'],
			['din','Dinka'],
			['div','Divehi; Dhivehi; Maldivian'],
			['doi','Dogri'],
			['dgr','Dogrib'],
			['dra','Dravidian (Other)'],
			['dua','Duala'],
			['nl','Dutch'],
			['dum','Dutch, Middle (ca.1050-1350)'],
			['dyu','Dyula'],
			['dzo','Dzongkha'],
			['frs','Eastern Frisian'],
			['efi','Efik'],
			['egy','Egyptian (Ancient)'],
			['eka','Ekajuk'],
			['elx','Elamite'],
			['eng','English'],
			['enm','English, Middle (1100-1500)'],
			['ang','English, Old (ca.450-1100)'],
			['myv','Erzya'],
			['epo','Esperanto'],
			['est','Estonian'],
			['ewe','Ewe'],
			['ewo','Ewondo'],
			['fan','Fang'],
			['fat','Fanti'],
			['fao','Faroese'],
			['pes','Farsi'],
			['fij','Fijian'],
			['fil','Filipino; Pilipino'],
			['fin','Finnish'],
			['fiu','Finno-Ugrian (Other)'],
			['vls','Flemish'],
			['fon','Fon'],
			['fre','French'],
			['frm','French, Middle (ca.1400-1600)'],
			['fro','French, Old (842-ca.1400)'],
			['fur','Friulian'],
			['ful','Fulah'],
			['gaa','Ga'],
			['gla','Gaelic; Scottish Gaelic'],
			['car','Galibi Carib'],
			['glg','Galician'],
			['lug','Ganda'],
			['gay','Gayo'],
			['gba','Gbaya'],
			['gez','Geez'],
			['kat','Georgian'],
			['ger','German'],
			['gmh','German, Middle High (ca.1050-1500)'],
			['goh','German, Old High (ca.750-1050)'],
			['gem','Germanic (Other)'],
			['gil','Gilbertese'],
			['gon','Gondi'],
			['gor','Gorontalo'],
			['got','Gothic'],
			['grb','Grebo'],
			['grc','Greek, Ancient (to 1453)'],
			['gre','Greek, Modern (1453-)'],
			['grn','Guarani'],
			['guj','Gujarati'],
			['gwi','Gwich\'in'],
			['hai','Haida'],
			['hat','Haitian; Haitian Creole'],
			['hau','Hausa'],
			['haw','Hawaiian'],
			['heb','Hebrew'],
			['her','Herero'],
			['hil','Hiligaynon'],
			['him','Himachali'],
			['hin','Hindi'],
			['hmo','Hiri Motu'],
			['hit','Hittite'],
			['hmn','Hmong'],
			['hun','Hungarian'],
			['hup','Hupa'],
			['iba','Iban'],
			['isl','Icelandic'],
			['ido','Ido'],
			['ibo','Igbo'],
			['ijo','Ijo languages'],
			['ilo','Iloko'],
			['smn','Inari Sami'],
			['inc','Indic (Other)'],
			['ine','Indo-European (Other)'],
			['ind','Indonesian'],
			['inh','Ingush'],
			['ina','Interlingua'],
			['ile','Interlingue; Occidental'],
			['iku','Inuktitut'],
			['ipk','Inupiaq'],
			['ira','Iranian (Other)'],
			['gle','Irish'],
			['mga','Irish, Middle (900-1200)'],
			['sga','Irish, Old (to 900)'],
			['iro','Iroquoian languages'],
			['ita','Italian'],
			['jpn','Japanese'],
			['jav','Javanese'],
			['jrb','Judeo-Arabic'],
			['jpr','Judeo-Persian'],
			['kbd','Kabardian'],
			['kab','Kabyle'],
			['kac','Kachin; Jingpho'],
			['kal','Kalaallisut; Greenlandic'],
			['xal','Kalmyk; Oirat'],
			['kam','Kamba'],
			['kan','Kannada'],
			['kau','Kanuri'],
			['kaa','Kara-Kalpak'],
			['krc','Karachay-Balkar'],
			['krl','Karelian'],
			['kar','Karen languages'],
			['kas','Kashmiri'],
			['csb','Kashubian'],
			['kaw','Kawi'],
			['kaz','Kazakh'],
			['kha','Khasi'],
			['khi','Khoisan (Other)'],
			['kho','Khotanese'],
			['kik','Kikuyu; Gikuyu'],
			['kmb','Kimbundu'],
			['kin','Kinyarwanda'],
			['kir','Kirghiz; Kyrgyz'],
			['tlh','Klingon; tlhIngan-Hol'],
			['kom','Komi'],
			['kon','Kongo'],
			['kok','Konkani'],
			['kor','Korean'],
			['kos','Kosraean'],
			['kpe','Kpelle'],
			['kro','Kru languages'],
			['kua','Kuanyama; Kwanyama'],
			['kum','Kumyk'],
			['kur','Kurdish'],
			['kru','Kurukh'],
			['kut','Kutenai'],
			['lad','Ladino'],
			['lah','Lahnda'],
			['lam','Lamba'],
			['day','Land Dayak languages'],
			['lao','Lao'],
			['lat','Latin'],
			['lav','Latvian'],
			['lez','Lezghian'],
			['lim','Limburgan; Limburger; Limburgish'],
			['lin','Lingala'],
			['lit','Lithuanian'],
			['jbo','Lojban'],
			['nds','Low German; Low Saxon; German, Low;'],
			['dsb','Lower Sorbian'],
			['loz','Lozi'],
			['lub','Luba-Katanga'],
			['lua','Luba-Lulua'],
			['lui','Luiseno'],
			['smj','Lule Sami'],
			['lun','Lunda'],
			['luo','Luo (Kenya and Tanzania)'],
			['lus','Lushai'],
			['ltz','Luxembourgish; Letzeburgesch'],
			['mkd','Macedonian'],
			['mad','Madurese'],
			['mag','Magahi'],
			['mai','Maithili'],
			['mak','Makasar'],
			['mlg','Malagasy'],
			['msa','Malay'],
			['mal','Malayalam'],
			['mlt','Maltese'],
			['mnc','Manchu'],
			['mdr','Mandar'],
			['man','Mandingo'],
			['mni','Manipuri'],
			['mno','Manobo languages'],
			['glv','Manx'],
			['mri','Maori'],
			['arn','Mapudungun; Mapuche'],
			['mar','Marathi'],
			['chm','Mari'],
			['mah','Marshallese'],
			['mwr','Marwari'],
			['mas','Masai'],
			['myn','Mayan languages'],
			['men','Mende'],
			['wtm','Mewati'],
			['mic','Mi\'kmaq; Micmac'],
			['min','Minangkabau'],
			['mwl','Mirandese'],
			['moh','Mohawk'],
			['mdf','Moksha'],
			['mol','Moldavian'],
			['mkh','Mon-Khmer (Other)'],
			['lol','Mongo'],
			['mon','Mongolian'],
			['mos','Mossi'],
			['mul','Multiple languages'],
			['mun','Munda languages'],
			['nqo','N\'Ko'],
			['nah','Nahuatl languages'],
			['nau','Nauru'],
			['nav','Navajo; Navaho'],
			['nde','Ndebele, North; North Ndebele'],
			['nbl','Ndebele, South; South Ndebele'],
			['ndo','Ndonga'],
			['nap','Neapolitan'],
			['new','Nepal Bhasa; Newari'],
			['nep','Nepali'],
			['nia','Nias'],
			['nic','Niger-Kordofanian (Other)'],
			['ssa','Nilo-Saharan (Other)'],
			['niu','Niuean'],
			['nog','Nogai'],
			['non','Norse, Old'],
			['nai','North American Indian'],
			['frr','Northern Frisian'],
			['sme','Northern Sami'],
			['nno','Norwegian Nynorsk; Nynorsk, Norwegian'],
			['nor','Norwegian'],
			['nub','Nubian languages'],
			['nym','Nyamwezi'],
			['nyn','Nyankole'],
			['nyo','Nyoro'],
			['nzi','Nzima'],
			['oci','Occitan (post 1500); Provençal'],
			['arc','Official Aramaic; Imperial Aramaic'],
			['oji','Ojibwa'],
			['ori','Oriya'],
			['orm','Oromo'],
			['osa','Osage'],
			['oss','Ossetian; Ossetic'],
			['oto','Otomian languages'],
			['pal','Pahlavi'],
			['pau','Palauan'],
			['pli','Pali'],
			['pam','Pampanga; Kapampangan'],
			['pag','Pangasinan'],
			['pan','Panjabi; Punjabi'],
			['pap','Papiamento'],
			['paa','Papuan (Other)'],
			['nso','Pedi; Sepedi; Northern Sotho'],
			['per','Persian'],
			['peo','Persian, Old (ca.600-400 B.C.)'],
			['phi','Philippine (Other)'],
			['phn','Phoenician'],
			['pon','Pohnpeian'],
			['pol','Polish'],
			['por','Portuguese'],
			['pra','Prakrit languages'],
			['pro','Provençal, Old (to 1500)'],
			['pus','Pushto; Pashto'],
			['que','Quechua'],
			['roa','Rhaeto-Romanic languages'],
			['raj','Rajasthani'],
			['rap','Rapanui'],
			['rar','Rarotongan; Cook Islands Maori'],
			['qaa','Reserved for local use'],
			['rgn','Romagnolo'],
			['roa','Romance (Other)'],
			['rum','Romanian'],
			['roh','Romansh'],
			['rom','Romany'],
			['run','Rundi'],
			['rus','Russian'],
			['sal','Salishan languages'],
			['sam','Samaritan Aramaic'],
			['smi','Sami languages (Other)'],
			['smo','Samoan'],
			['sad','Sandawe'],
			['sag','Sango'],
			['san','Sanskrit'],
			['sat','Santali'],
			['srd','Sardinian'],
			['sas','Sasak'],
			['sco','Scots'],
			['sel','Selkup'],
			['sem','Semitic (Other)'],
			['srp','Serbian'],
			['srr','Serer'],
			['shn','Shan'],
			['sna','Shona'],
			['iii','Sichuan Yi; Nuosu'],
			['scn','Sicilian'],
			['sid','Sidamo'],
			['sgn','Sign Languages'],
			['bla','Siksika'],
			['snd','Sindhi'],
			['sin','Sinhala; Sinhalese'],
			['sit','Sino-Tibetan (Other)'],
			['sio','Siouan languages'],
			['sms','Skolt Sami'],
			['den','Slave (Athapascan)'],
			['sla','Slavic (Other)'],
			['slo','Slovak'],
			['slv','Slovenian'],
			['sog','Sogdian'],
			['som','Somali'],
			['son','Songhai languages'],
			['snk','Soninke'],
			['wen','Sorbian languages'],
			['sot','Sotho, Southern'],
			['sai','South American Indian (Other)'],
			['alt','Southern Altai'],
			['sma','Southern Sami'],
			['spa','Spanish'],
			['srn','Sranan Tongo'],
			['suk','Sukuma'],
			['sux','Sumerian'],
			['sun','Sundanese'],
			['sus','Susu'],
			['sot','Sutu'],
			['swa','Swahili'],
			['ssw','Swati'],
			['swe','Swedish'],
			['gsw','Swiss German; Alemannic; Alsatian'],
			['syr','Syriac'],
			['tgl','Tagalog'],
			['tah','Tahitian'],
			['tai','Tai (Other)'],
			['tgk','Tajik'],
			['tmh','Tamashek'],
			['tam','Tamil'],
			['tat','Tatar'],
			['tel','Telugu'],
			['ter','Tereno'],
			['tet','Tetum'],
			['tha','Thai'],
			['tib','Tibetan'],
			['tig','Tigre'],
			['tir','Tigrinya'],
			['tem','Timne'],
			['tiv','Tiv'],
			['tli','Tlingit'],
			['tpi','Tok Pisin'],
			['tkl','Tokelau'],
			['tog','Tonga (Nyasa)'],
			['ton','Tonga (Tonga Islands)'],
			['tsi','Tsimshian'],
			['tso','Tsonga'],
			['tsn','Tswana'],
			['tum','Tumbuka'],
			['tup','Tupi languages'],
			['tur','Turkish'],
			['ota','Turkish, Ottoman (1500-1928)'],
			['tuk','Turkmen'],
			['tvl','Tuvalu'],
			['tyv','Tuvinian'],
			['twi','Twi'],
			['udm','Udmurt'],
			['uga','Ugaritic'],
			['uig','Uighur; Uyghur'],
			['ukr','Ukrainian'],
			['umb','Umbundu'],
			['mis','Uncoded languages'],
			['und','Undetermined'],
			['hsb','Upper Sorbian'],
			['urd','Urdu'],
			['uzb','Uzbek'],
			['vai','Vai'],
			['ven','Venda'],
			['vec','Vèneto'],
			['vie','Vietnamese'],
			['vol','Volapük'],
			['vot','Votic'],
			['wak','Wakashan languages'],
			['wal','Walamo'],
			['wln','Walloon'],
			['war','Waray'],
			['was','Washo'],
			['wel','Welsh'],
			['fry','Western Frisian'],
			['wol','Wolof'],
			['xho','Xhosa'],
			['sah','Yakut'],
			['yao','Yao'],
			['yap','Yapese'],
			['yid','Yiddish'],
			['yor','Yoruba'],
			['ypk','Yupik languages'],
			['znd','Zande languages'],
			['zap','Zapotec'],
			['zza','Zaza; Dimili; Dimli; Kirdki; Kirmanjki; Zazaki'],
			['zen','Zenaga'],
			['zha','Zhuang; Chuang'],
			['zul','Zulu'],
			['zun','Zuni']
		],


		//cache DOM
		_headerButtons,
		_headerButton_BookEditionsLang,
		_headerReplaceBook_Counters,
		_headerBookshelves_Counters,
		_bookTitle,
		_bookEditionLanguageFound,
		
		//CITAZIONI
/*TODO
move to external .js file
*/
		_CITAZIONI=[
			['Dio creò l’asino e gli diede una pelle dura','Albert Einstein']
			,['È meglio essere ottimisti ed avere torto piuttosto che pessimisti ed avere ragione','Albert Einstein']
			,['I migliori auguri eccetera, soprattutto questi ultimi','Albert Einstein']
			,['La ricerca della verita\' e\' piu\' preziosa del suo possesso','Albert Einstein']
			,['La vita è come una bicicletta. Per mantenere l’equilibrio bisogna continuare a muoversi','Albert Einstein']
			,['La miglior vendetta è vendicarsi','Alberto Molinari']
			,['Cerco il filo della ragione, ma il filo non esiste, o mi ci sono ingrovigliato dentro','Alda Merini']
			,['Ho sempre tenuto in poco conto la cultura intesa come cosa che fa crescere agli occhi degli altri e alla loro considerazione. La cultura non deve meravigliare che chi l’apprende, e mai gli altri','Alda Merini']
			,['Le mosche non riposano mai perché la merda è davvero tanta','Alda Merini']
			,['Oggi mi sono laureata. Ho preso la laurea del sogno. L’esattore dei sogni ha in mano i biglietti della partenza. Quando mi darà il mio? Siamo in tanti, aspettiamo di prendere quel treno. Fora questo biglietto. Dimmi che Lui è vivo','Alda Merini']
			,['La salma è la virtù dei morti','Alessandro Bergonzoni']
			,['Mors tua, cane meo','Alessandro Bergonzoni']
			,['Sono molto contento di essere qui, come dice uno dei nipotini di Paperone','Alessandro Bergonzoni']
			,['Stai colmo!','Alessandro Bergonzoni']
			,['Abitudine: catena ai piedi dell’uomo libero','Ambrose Bierce']
			,['Bacco: divinità di comodo, inventata dagli antichi come buona scusa per sbronzarsi','Ambrose Bierce']
			,['Casa: ultimo rifugio, aperto tutta la notte','Ambrose Bierce']
			,['Inumanità: uno dei tratti caratteristici e distintivi dell’umanità','Ambrose Bierce']
			,['Oceano: massa d’acqua che occupa due terzi di un mondo destinato all’uomo - che però non ha le branchie','Ambrose Bierce']
			,['Pentimento: fedele compagno e seguace del castigo. Di solito si manifesta con un grado di ravvedimento non incompatibile con il perseverare nel peccato','Ambrose Bierce']
			,['L\'uomo di Neanderthal è stato scoperto molto tardi. D\'altronde lo stesso Neanderthal non è che ci tenesse a far sapere che stava con un uomo','Anatolj Balasz']
			,['Colombo avrebbe fatto meglio a scoprire l\'America con una nave carica di pazzi','André Breton']
			,['La paura è un fantasma. Abbracciala e tutto ciò che vedrai fra le tue braccia sarai tu','Andre Dubus']
			,['La vita non presenta mai nulla che non si possa considerare tanto un nuovo punto di partenza quanto una fine','André Gide']
			,['Nella vita bisogna imparare due cose: non mettersi mai davanti al più forte nè dietro all\'asino, perché entrambi non ragionano e ti prendono a calci in faccia','Anilda Ibrahimi']
			,['Una convincente impossibilità è preferibile ad una non convincente possibilità','Aristotele']
			,['Il lavoro di équipe è essenziale. Ti permette di dare la colpa a qualcun altro (Ottava regola di Finagle)','Arthur Bloch']
			,['Quando pensi di non farcela e stai per arrenderti devi tenere duro e ritentare fino ad ottenere un fallimento definitivo e irrimediabile','Arthur Bloch']
			,['Quando ti morde un lupo, pazienza. Quel che secca è quando ti morde una pecora','Arthur Bloch']
			,['Una cravatta pulita attrae la zuppa del giorno','Arthur Bloch']
			,['L’uomo può fare ciò che vuole, ma non può volere ciò che vuole','Arthur Schopenhauer']
			,['Detesto le persone che hanno un cane. Sono dei vigliacchi che non hanno il coraggio di mordere la gente da sé','August Strindberg']
			,['I sogni devono essere eccessivi, sempre. Ci penserà la realtà, poi, a ridimensionarli','B. Brussa']
			,['Basta con i piaceri della carne! Facciamo godere anche le verdure','Bagatto']
			,['È facile vivere a occhi chiusi, fraintendendo tutto ciò che si vede','Beatles']
			,['C\'è gente che tiene il vino benissimo: non si ubriaca nemmeno se l\'imbottigli','Beppe Viola']
			,['Ci sedemmo dalla parte del torto visto che tutti gli altri posti erano occupati','Bertolt Brecht']
			,['Era un paese così piccolo che non avevamo neanche lo scemo del villaggio. Dovevamo fare a turno','Billy Holiday']
			,['New Orleans è così violenta che se vai a comprare un paio di calze di nylon ti chiedono la misura della testa','Billy Holiday']
			,['Dovevate starvene seduti a casa, sul culo...','Bohumil Hrabal']
			,['Essere innocenti è pericoloso perché non si hanno alibi','Boris Makaresko']
			,['Se il denaro crescesse sugli alberi a me capiterebbe un bonsai','Boris Makaresko']
			,['Come era solito dire mio padre, se il Signore avesse avuto più rispetto per il denaro l\'avrebbe dato a una diversa classe sociale','Bret Maverick']
			,['È proibito proibire','Caetano Veloso']
			,['Noi siamo stranieri quasi dappertutto','Carmine Abate']
			,['Trova ciò che ami e lascia che ti uccida','Charles Bukowski']
			,['"Come hai dormito la notte scorsa?" "Oh, dormo piuttosto bene di notte, il problema è vivere durante il giorno, è quello il difficile"','Charles M. Schulz']
			,['"Visto? Te l\'avevo detto!" "Cosa?" "Quest\'anno non è affatto meglio dell\'anno scorso!"','Charles M. Schulz']
			,['Mi sono slogato lo stomaco!','Charles M. Schulz']
			,['Uffa! È inutile! Per quanto faccia non riesco ad andare in letargo!','Charles M. Schulz']
			,['Una volta cercavo di prendere ogni giorno come veniva...si, insomma, vivere alla giornata...ora la mia filosofia è cambiata. Mezza giornata alla volta basta e avanza!','Charles M. Schulz']
			,['Undicisei, Trentadodici Oltrantotto','Charles M. Schulz']
			,['Le opinioni sono come le palle: ognuno ha le sue','Clint Eastwood']
			,['Non avere amici che non siano alla tua altezza','Confucio']
			,['Invecchiare, che orrore!, ma è l\'unico modo che ho trovato per non morire giovane','Daniel Pennac']
			,['La memoria è l\'immaginazione al contrario','Daniel Pennac']
			,['Quando la vita è appesa a un filo, è incredibile il prezzo del filo!','Daniel Pennac']
			,['Secondo te Juri, qual è la differenza tra capitalismo e socialismo?" Il capitalismo è lo sfruttamento dell\'uomo sull\'uomo, mentre il socialismo è il contrario','Danilo Acquisti']
			,['È meglio vivere che essere felici','Edu Lobo']
			,['Un amico è uno che sa tutto di te e nonostante questo gli piaci','Elbert Hubbard']
			,['​Questo minuto aveva più di sessanta secondi','Elie Wiesel']
			,['Tra il dire e il fare c\'è di mezzo "e il"','Elio e le Storie Tese']
			,['​"Dio mio", aveva aggiunto Bunny, soffiandosi il naso. "A volte mi sembra di non poter mai vincere". "Non puoi vincere", aveva risposto Henry. "Puoi solo fare del tuo meglio".','Elizabeth Strouts']
			,['Ci sono molti modi di arrivare, il migliore è partire','Ennio Flaiano']
			,['Chissà se le stelle per esprimere un desiderio devono aspettare che cada la terra','Enzo Jacchetti']
			,['I coglioni sono molto più di due','Eros Drusiani']
			,['La Grazia, nelle sue rare apparizioni, deve unirsi a una tecnica ben educata','Etty Hillesum']
			,['Se il figliol prodigo avesse preannunciato il suo arrivo, il vitello grasso avrebbe mangiato meno','Fabio Di Iorio']
			,['E se un ragno soffrisse di vertigini?','Fabio Fazio']
			,['Mi domando, ma i genitori dei sette nani erano ubriachi quando han scelto quei nomi lì ai loro figli','Fabio Fazio']
			,['Ci sforziamo di dare un senso, una forma, un ordine alla vita, e alla fine la vita fa di noi quello che le va','Fernando Aramburu']
			,['Anticamente il diamante era venerato da alcuni popoli della terra, oggi da tutti!','Fosco Maraini']
			,['Siamo tutti appesi a un filo. E io sono anche sovrappeso','Franco Zuin']
			,['Nella lotta tra te e il mondo, stai dalla parte del mondo','Frank Zappa']
			,['Tutto è ostacolo, ma può divenire gradino, se si ha l\'insistenza necessaria','Franz Kafka']
			,['"Quanto manca alla vetta?" "Tu sali e non pensarci!"','Friedrich Nietzsche']
			,['Bisogna avere un caos dentro di sè, per generare una stella danzante','Friedrich Nietzsche']
			,['Nessun vincitore crede al caso','Friedrich Nietzsche']
			,['Non esistono fatti, ma solo interpretazioni','Friedrich Nietzsche']
			,['Un inglese, anche se è solo, forma ordinatamente una fila di una persona','George Mikes']
			,['Libertà significa il diritto di dire alla gente quello che la gente non vuol sentire','George Orwell']
			,['Il fanatismo consiste nel raddoppiare gli sforzi quando si è dimenticato lo scopo','George Santillana']
			,['Il vizio ha le sue regole, come ogni altra cosa','Gerald Brenan']
			,['Perché gli scacchi non sono semplicemente un gioco. Sono guerra, teatro e morte. Cioè, tutt\'intera, la vita','Gesualdo Bufalino']
			,['Le favole non dicono ai bambini che i draghi esistono. Perché i bambini lo sanno già. Le favole dicono ai bambini che i draghi possono essere sconfitti.','Gilbert K. Chesterton']
			,['In Russia sta proprio cambiando tutto. Ho visto dei bambini che mangiavano i comunisti','Gino & Michele']
			,['Io ho un amico così pigro, così pigro, ma così pigro che ha sposato una donna incinta','Gino Bramieri']
			,['Uva: vino in pillole','Gioacchino Rossini']
			,['Perché i democristiani non si liberano dei socialisti? Perché hanno paura di rimanere soli coi democristiani','Giovanni Mosca']
			,['La bellezza è negli occhi di chi guarda','Goethe']
			,['Vivere a dispetto di ogni male','Goethe']
			,['L’uomo, il coronamento della creazione, un maiale','Gottfried Benn']
			,['Il guaio dell\'amore è che molte persone lo confondono con la gastrite','Groucho Marx']
			,['Il matrimonio è la causa prima del divorzio','Groucho Marx']
			,['Non dimentico mai una faccia, ma nel vostro caso farò un\'eccezione','Groucho Marx']
			,['Niente è eterno, solo il cambiamento','Heinrich Heine']
			,['Il segreto della felicità consiste nella buona salute e nella cattiva memoria','Ingrid Bergman']
			,['Il miglioramento è sempre un avvertimento del peggio che deve venire','J.M. Coetzee']
			,['L\'ottimista pensa che questo sia il migliore dei mondi possibili. Il pessimista sa che è vero','J.Robert Oppenheimer']
			,['Se George Washington fosse vivo oggi sarebbe notato soprattutto per la sua incredibile età','Jack Klugman']
			,['Nessun uomo è un’isola, intero in se stesso','James Thurber']
			,['...ma c\'è voluto del talento per riuscire ad invecchiare senza diventare adulti','Jaques Brel, Franco Battiato']
			,['Appoggiatevi fortemente ai vostri principi. Vedrete che prima o poi si piegheranno','Jean Moréas']
			,['Nessun uomo è un’isola, intero in se stesso','John Donne']
			,['Perdona i tuoi nemici, ma non dimenticarti mai i loro nomi','John Fitzgerald Kennedy']
			,['Forse le riunioni del Consiglio di sicurezza dell\'Onu non dovrebbero cominciare prima che l\'assemblea abbia ascoltato Bach per almeno mezz\'ora, perché chi riesce a pensare in modo disonesto e meschino, chi desidera altro al di fuori della bellezza, l\'armonia e la giustizia dopo mezz\'ora di Bach è uno squilibrato. Un pazzo furioso','Jón Kalman Stefánsson']
			,['Il mondo senza musica, è come il sole senza luce, una risata senza gioia, un pesce senz\'acqua, un uccello senza ali. Come essere condannato ad abitare sul lato oscuro della luna, con vista sul buio e sulla solitudine','Jón Kalman Stefánsson']
			,['L\'inferno ha due poli: uno si chiama denaro, l\'altro potere','Jón Kalman Stefánsson']
			,['L\'uomo è nato per amare, ecco quant\'è semplice il fondamento dell\'esistenza. Per questo il cuore batte, questa strana bussola, e grazie a lui possiamo facilmente orientarci anche in mezzo alle nebbie più fitte e piene di pericoli, a causa sua ci smarriamo e moriamo in pieno sole','Jón Kalman Stefánsson']
			,['La cosa più dolorosa dev\'essere non avere amato abbastanza','Jón Kalman Stefánsson']
			,['Non so molto della vita. Probabilmente non c\'è bisogno di sapere molto della vita, basta entrarci dentro. E saperla accogliere quando arriva','Jón Kalman Stefánsson']
			,['Quant’è bello ritrovarti, non sei cambiato per niente, forse solo un po’ più brutto, e già allora non te lo potevi permettere!','Jón Kalman Stefánsson']
			,['Se Dio è femmina allora il diavolo dev\'essere per forza maschio','Jón Kalman Stefánsson']
			,['Se esiste il regno dei cieli, vi si coltivano senz\'altro le viti','Jón Kalman Stefánsson']
			,['A volte, l\'unico modo di avere ragione sta nel perderla','José Bergamín']
			,['La noia delle ostriche produce perle','José Bergamín']
			,['È una questione di pulizia: bisogna cambiare opinione, così come si cambia la camicia','Jules Renard']
			,['Chi ha qualcosa da dire si faccia avanti e taccia','Karl Kraus']
			,['Il diavolo è un ottimista se si illude di poter peggiorare l\'umanità','Karl Kraus']
			,['Niente è duraturo come il cambiamento','Karl Ludwig Börne']
			,['Se rispetti tutte le regole... ti perdi tutto il divertimento','Katharine Hepburn']
			,['È più facile per un cammello passare per la cruna di un ago se questa è lievemente oliata','Kehlog Albran']
			,['Un buon ascoltatore di solito sta pensando a qualcos\'altro','Kin Hubbard']
			,['Invece che maledire il buio, è meglio accendere una candela','Lao Tze']
			,['Quello in cui viviamo è il migliore dei mondi possibili','Leibnitz']
			,['Vissero infelici perché costava meno','Leo Longanesi']
			,['Di ciò di cui non si può parlare, si deve tacere','Ludwig Wittgenstein']
			,['I limiti del mio linguaggio significano i limiti del mio mondo','Ludwig Wittgenstein']
			,['Il mondo è tutto ciò che accade','Ludwig Wittgenstein']
			,['L\'immagine logica dei fatti è il pensiero','Ludwig Wittgenstein']
			,['Merita di essere raggiunto dalla sua epoca colui il quale si limita ad anticiparla','Ludwig Wittgenstein']
			,['Nulla dire se non ciò che può dirsi','Ludwig Wittgenstein']
			,['Sei come uno che guarda fuori da una finestra chiusa, e non capisce gli strani movimenti di un passante. Chi è all’interno non può sapere che fuori infuria una tempesta, e che il passante sta solo facendo del suo meglio per reggersi in piedi','Ludwig Wittgenstein']
			,['Coloro che tentano di raggiungere l\'assurdo otterranno l\'impossibile','M.C.Escher']
			,['Errare è umano. Ma ti fa sentire divino','Mae West']
			,['Quando sono buona so essere molto buona, ma quando sono cattiva sono meglio!','Mae West']
			,['La differenza tra ciò che facciamo e ciò che saremmo in grado di fare sarebbe sufficiente a risolvere la maggior parte dei problemi del mondo','Mahatma Gandhi']
			,['Che genio era quel Picasso… un vero peccato che non abbia dipinto nulla','Marc Chagall']
			,['Un bel giorno (ma tutti i giorni sono belli)...','Marc Chagall']
			,['La cosa più deliziosa non è non aver nulla da fare: è aver qualcosa da fare, e non farla','Marcel Achard']
			,['Anche le formiche nel loro piccolo si incazzano','Marcello Marchesi']
			,['Vivere richiede le doti dei lottatori, non l\'arte dei danzatori. Stare in piedi è tutto, non occorre saper fare passetto eleganti.','Marco Aurelio']
			,['Anche Michelangelo ha fatto le sue cappelle','Mario e Pippo Santonastaso']
			,['Mamma a Natale faceva il tacchino. Un\'imitazione di merda','Mario Zucca']
			,['Se i pesci non abboccano all\'amo, provate con "la stimo profondamente"','Mario Zucca, Valerio Peretti']
			,['Il paradiso lo preferisco per il clima, l\'inferno per la compagnia','Mark Twain']
			,['Sii sempre il meglio di ciò che sei','Martin Luther King']
			,['La primavera è in ritardo. Si pensa che sia rimasta incinta','Massimo Boldi']
			,['​Tutto ciò che non uccide rende più forti. A volte può ferire, però','Mathias Malzieu']
			,['Amare significa poco dolci','Maurizio Sangalli']
			,['Il fine giustifica i mezzi, il rozzo se ne sbatte i coglioni','Maurizio Sangalli']
			,['L\'ozio è il padre dei miei cugini','Maurizio Sangalli']
			,['Se i Presidenti non lo fanno alle loro mogli, allora lo fanno al Paese','Mel Brooks']
			,['Non c’è una vita migliore di un’altra. Devi cercare di scegliere il cammino che tu ritieni più giusto. Così raggiungi una sorta di perfezione nella tua vita. Anche se agli altri non sembrerà tale','Morten Brask']
			,['Quando viene abbandonata una linea ferroviaria, i binari non sono divelti, ma rimangono sotto gli sterpi e l\'erba, a segnare il tracciato','Nadine Gordimer']
			,['Il potere di scegliere fra il bene e il male è alla portata di tutti','Origene']
			,['Aveva il tipo di volto che, una volta visto, non si ricorda più','Oscar Wilde']
			,['Ci sono persone che sanno tutto e purtroppo è tutto quello che sanno','Oscar Wilde']
			,['Esperienza è il nome che tutti danno ai loro errori','Oscar Wilde']
			,['Si può resistere a tutto salvo alle tentazioni','Oscar Wilde']
			,['Il mondo di oggi non ha senso, perché dovrei dipingere quadri che ne hanno?','Pablo Picasso']
			,['La sfiga è un amante fedele e non ti abbandona neanche quando sei nella merda','Paco D\'Alcatraz']
			,['Se hai culo, la sfiga è lì che te lo guarda','Paco D\'Alcatraz']
			,['Se la vita ti sorride, ha una paresi','Paco D\'Alcatraz']
			,['Era un mondo adulto. Si sbagliava da professionisti','Paolo Conte']
			,['Si nasce e si muore soli. Certo che in mezzo c\'è un bel traffico','Paolo Conte']
			,['Prometto di non dire più che i socialisti rubano. In cambio i socialisti potrebbero smettere di rubare','Paolo Hendel']
			,['Che paese l\'Italia: mi sono distratto un attimo e non è successo niente','Pericoli & Pirella']
			,['I 40 anni sono quell\'età in cui ci si sente finalmente giovani. Ma è troppo tardi','Picasso']
			,['Sono i genitori che fanno i figli, ma dopo la nascita','Pierre-Auguste Renoir']
			,['Una mattina uno di noi aveva finito il nero, e fu così che nacque l\'Impressionismo','Pierre-Auguste Renoir']
			,['Colui che possiede la verità, ha anche il diritto di mentire','Platone']
			,['Magari fosse stato facile smettere di provare sentimenti...','Rachel Joyce']
			,['La mamma è la parte più femminile dei genitori','Roberto Benigni']
			,['La fortuna è cieca, ma la sfiga ci vede benissimo','Roberto Freak Antoni']
			,['Tutti gli uomini sono commedianti. Salvo, forse, qualche attore','Sacha Guitry']
			,['Chi non preferirebbe diventare più stupido per la felicità, piuttosto che più saggio per il dolore','Salvador Dalì']
			,['Se attraverso la tua condotta e la tua opera non riesci a piacere a tutti, accontentati di piacere a pochi. Piacere a molti è una brutta cosa','Schiller']
			,['È certo che un uomo può fare ciò che vuole, ma non può volere ciò che vuole','Schopenhauer']
			,['Un uomo può fare ciò che vuole, ma non può volere ciò che vuole','Schopenhauer']
			,['La vita è come una commedia: non importa quanto è lunga, ma come è recitata','Seneca']
			,['Pensare ciò che si vuole e dire ciò che si pensa','Spinoza']
			,['Tutto perduto, niente perduto','Stendhal']
			,['Svegliarsi è un lancio in paracadute dai sogni','Tomas Tranströmer']
			,['Ho scoperto qualcosa che fa il lavoro di 10 uomini. 10 donne','Tony Randall']
			,['Siamo brutti, ma la vita è bella','Toulouse-Lautrec']
			,['Sapete qual è la differenza tra una brava persona e una cattiva? La brava persona le fa controvoglia, le porcherie','Vasilij Grossman']
			,['Sogno di dipingere e poi dipingo il mio sogno','Vincent Van Gogh']
			,['Giovanni Paolo II, perché il primo non era riuscito bene','Vincino']
			,['Audentes fortuna iuvat. La fortuna aiuta gli audaci','Virgilio']
			,['La felicità non è che un sogno, e il dolore è reale','Voltaire']
			,['La torre di Pisa...e se avesse ragione lei?','Walter Valdi']
			,['Mi sono sempre chiesto: ma chi va in giro a costruire quadrati sull\'ipotenusa','Walter Valdi']
			,['Quando ti viene data la possibilità di scegliere se avere ragione o essere gentile, scegli di essere gentile.','Wayne W.Dyer']
			,['You never get a second chance to make a good first impression','Will Rogers']
			,['Mai, mai, mai rinunciare','Winston Churchill']
			,['I cattivi hanno sicuramente capito qualcosa che i buoni ignorano','Woody Allen']
			,['Il leone e il vitello giaceranno insieme, ma il vitello dormirà ben poco','Woody Allen']
			,['Si vive una volta sola. E qualcuno neanche una','Woody Allen']
			,['Se arrivate ad un bivio, imboccatelo','Yogi Berra']
			,['Due cose sono infinite, l’universo e la stupidità umana, ma sull’universo ho ancora dei dubbi','Albert Einstein']
			,['La cura per la noia è la curiosità. Non c\'è cura per la curiosità','Ellen Parr']
			,['La nostra testa è rotonda, perché così il pensiero può cambiare direzione','Francis Picabia']
			,['Il mondo è indipendente dalla mia volontà','Ludwig Wittgenstein']
			,['Il modo migliore per realizzare un sogno è quello di svegliarsi','Paul Valéry']
			,['Non pronunciare il nome di Dio invano, scegli il momento in cui serve','Ambrose Bierce']
			,['Dio non è morto. È vivo e lavora a un progetto molto meno ambizioso','Charles Bukowski']
			,['Se Dio esiste, spero che abbia una scusa valida','Daniel Pennac']
			,['--Padre Nostro (uno dei "Quarantanove racconti")-- Nulla nostro, che sei nel nulla, sia santificato il tuo nulla, venga il tuo nulla, sia fatto il tuo nulla, dovunque nel nulla. Dacci oggi il nostro nulla quotidiano, e rimetti a noi i nostri nulla, come noi li rimettiamo agli altri nulla. E non ci indurre in tentazione, ma liberaci dal nulla. Amen.','Ernest Hemingway']
			,['Negli anni 5, 4, 3, 2 e 1 avanti Cristo si intuiva che stava per succedere qualcosa','Fabio Di Iorio']
			,['La Chiesa è esattamente ciò contro cui Gesù predicò e contro cui insegnò ai suoi discepoli a combattere','Friedrich Nietzsche']
			,['Padre nostro che sei nei cieli, restaci','Jacques Prévert']
			,['Non so come Dio ce l\'abbia fatta. Per me è durissima','John Huston']
			,['L\'astronomia è ciò che abbiamo oggi in luogo della teologia. Le paure sono di meno, ma le consolazioni sono ridotte a zero','John Updike']
			,['Forse non è dio che ha creato il peccato, è il contrario','Jón Kalman Stefánsson']
			,['Cristo è morto per i nostri peccati. Abbiamo il coraggio di rendere inutile il suo martirio non commettendone?','Jules Feiffer']
			,['Gesù non beve. Fumava, ma ha smesso','Marco Cicala']
			,['Mi piace credere e sono diventato addirittura un sognatore professionista, però voglio decidere io in cosa credere','Mathias Malzieu']
			,['Ho sentito alla radio che anche quest\'anno il papà andrà in vacanza in montagna. Ho pensato: Maometto era più fortunato. Lui in montagna ci andava un anno si e uno no','Paolo Rossi']
			,['Vado a prendere la mia porzione di medioevo. [riguardo alla messa]','Paul Cézanne']
			,['Le religioni sono figlie dell’ignoranza, e non sopravvivono a lungo alla madre','Schopenhauer']
			,['Io non so se Dio esiste, ma se non esiste ci fa una figura migliore','Stefano Benni']
			,['Un mistico è uno che è stato faccia a faccia con Dio. Io l’ho solo visto passare velocemente di lato. E a volte non sono nemmeno sicuro di questo.','Tomas Tranströmer']
			,['Non bisogna giudicare il buon Dio da questo mondo perché è uno schizzo che gli è venuto male','Vincent Van Gogh']
			,['Se Dio non esistesse bisognerebbe inventarlo','Voltaire']
			,['Era un bambino presuntuoso e saccente. Quando la maestra di prima elementare gli chiese: "Ma tu credi in Dio?", lui rispose:"Beh, credere è una parola grossa. Diciamo che lo stimo"','Walter Fontana']
			,['Potrei credere solo a un dio che sapesse danzare','Friedrich Nietzsche']
			,['Sei la mia speranza in un mondo migliore, baby','Guido Catalano']
			,['Con il crescere della fama divento sempre più stupido, il che naturalmente è un fenomeno assai comune','Albert Einstein']
			,['Gusto il peccato come fosse il principio del benessere','Alda Merini']
			,['Mi sveglio sempre in forma, e mi deformo attraverso gli altri','Alda Merini']
			,['Non sono più quella di ieri, non so come sarò domani. Ma posso dirti come sono oggi, con i miei ieri','Alda Merini']
			,['Quando ho mangiato bene mi informo sul destino degli altri','Alda Merini']
			,['Se Dio mi assolve lo fa sempre per insufficienza di prove','Alda Merini']
			,['Cosa non darei per fuggire all\'ovest di me stesso','Altan']
			,['Mi piacerebbe sapere chi è il mandante di tutte le cazzate che faccio','Altan']
			,['Penso, quindi sono. È non faccio un cazzo','Altan']
			,['Aiutami a capire ciò che dico e ve lo formulerò meglio','Antonio Machado']
			,['Toccato il fondo non puoi che risalire. A me capita di incominciare a scavare','Bruno Agostini']
			,['È meglio essere un ubriacone famoso che un alcolista anonimo','Charles Bukowski']
			,['Il problema è che le persone intelligenti sono piene di dubbi e le persone stupide sono piene di sicurezza','Charles Bukowski']
			,['Se ci si potesse realmente nascondere nelle fantasie, non mi troverebbe più nessuno','Charles Lewinsky']
			,['Gli anni con me sono stati gentili... Invece i mesi ed i giorni sono stati un po\' villani','Charles M. Schulz']
			,['Leggere è la mia ricompensa alla fine della giornata','Cheryl Strayed']
			,['Non sono poi tanto meglio di un maiale','Claude Monet']
			,['Non sono pessimista, diciamo che sono un ottimista ben informato','Daniel Pennac']
			,['Io sto alla figa come un diabetico alla Sachertorte','Dario Vergassola']
			,['Sono maschio. Ma non esercito','Dario Vergassola']
			,['Ho il cuore tenero, non è mica di legno. Me l\'hanno spezzato di brutto e questo non è bello','Duke Ellington']
			,['Lei non può immaginare quanto io non sia irremovibile nelle mie idee','Ennio Flaiano']
			,['Gli uomini si dividono in due categorie: i geni e quelli che dicono di esserlo. Io sono un genio','Enzo Costa']
			,['Non parliamo di come sono io. È un argomento che conosco troppo bene per aver voglia di pensarci ancora','Ernest Hemingway']
			,['Quando sentirai il telefono che non suona, sarò io che non ti chiamo','Fannie Flagg']
			,['Ieri con la sola forza del pensiero sono riuscito a esprimere un\'opinione','Francisco Durabàl']
			,['Sarò bre...','Francisco Durabàl']
			,['...firmato/in fede: Io proprio Io','Gabriel Garcia Marquez']
			,['Di mamma ce n\'è una sola, la mia','Gabriel Garcia Marquez']
			,['Non faccio per vantarmi ma oggi è una bellissima giornata','Giuseppe Gioachino Belli']
			,['Vorrei morire sano dopo di esser vissuto malato tutta la vita','Goldoni']
			,['È difficile che chi sta cercando di raggiungere una meta si unisca a una persona che non deve andare da nessuna parte. Ma possiamo provare. Se porterai la mia borsa, potrai seguirmi','Henning Mankell']
			,['Se nasco un\'altra volta ci rinuncio','Ivan Della Mea']
			,['La pazzia è come il paradiso. Quando arrivi al punto in cui non te ne frega più niente di quello che gli altri possono dire, sei vicino al cielo','Jimi Hendrix']
			,['Scusatemi mentre bacio il cielo! (da Purple Haze, n° 1)','Jimi Hendrix']
			,['Non è che abbiamo speranza, la proteggiamo','John Berger']
			,['Se impari a ridere delle cose che ti fanno più male diventerai il più forte di tutti','John Waters']
			,['Non avevo il coraggio di perdere il sogno che stavo facendo','Jón Kalman Stefánsson']
			,['Ecco quel che sono veramente; cattivo, sbronzo, ma in gamba','Joseph Roth']
			,['Io riesco a trovare ogni parola sul dizionario molto più velocemente da quando ho scoperto che sono in ordine alfabetico','Leopold Fechtner']
			,['Penso, dunque single','Lizz Winstead']
			,['Amo l\'idea anarchica di venire dal nulla, ma credo sia perché ho radici solide','Lucian Freud']
			,['Dio ha dunque dimenticato quel che ho fatto per lui','LuigiXIV']
			,['Fatemi lavorare due ore al giorno e passerò le altre ventidue a sognare','Luis Bunuel']
			,['Tra due mali scelgo sempre quello che non ho mai provato','Mae West']
			,['Mi sono imposto di contraddirmi per evitare di confermare il mio gusto personale','Marcel Duchamp']
			,['Mi sento sotto la cresta dell\'onda','Marcello Marchesi']
			,['Per mio padre io non ero un coglione. Ero l\'altro','Mario Zucca']
			,['Un giorno portai alla maestra una mela e lei mi diede un bacio. Il giorno dopo le portai un\'anguria e lei non capì','Mario Zucca']
			,['Devo ritirarmi nelle mie stanze per una siesta ristoratrice di qualche secolo','Mathias Malzieu']
			,['Mi sento Benjamin Button alla fine della storia. Un vecchio neonato grinzoso','Mathias Malzieu']
			,['Sono sopravvissuto a un atterraggio d’emergenza dentro di me. Le papille gustative delle emozioni sono in massima allerta','Mathias Malzieu']
			,['Un piccolissimo passo per l\'uomo, lo ammetto, ma un grande passo per la mia umanità','Mathias Malzieu']
			,['Ogni volta che mi guardo allo specchio mi convinco sempre più che Dio ha un ottimo senso dell\'umorismo','Matteo Molinari']
			,['Dice: bisogna lottare per la qualità della vita. Io mi accontenterei di una sottomarca','Max Greggio']
			,['Sono messo malissimo: come megalomane mi credo Dio, ma in quanto ateo ho pochissima fiducia in me stesso','Max Greggio']
			,['Tutta la mia vita è un film. Solo che non ci sono le dissolvenze. Sono costretto a vivere ogni singola scena. La mia vita ha bisogno di montaggio','Mort Sahl']
			,['Perdonami, perché so bene quello che faccio','Nadine Gordimer']
			,['Al giorno d\'oggi non è facile essere niente. In ogni campo c\'è una concorrenza eccessiva','Oscar Wilde']
			,['Be yourself; everyone else is already taken','Oscar Wilde']
			,['Io sono stufo della gente intelligente. Al giorno d\'oggi tutti sono intelligenti. Li incontri dappertutto: stanno diventando un pericolo pubblico. Come vorrei che ci fosse rimasto ancora qualche cretino','Oscar Wilde']
			,['Riesco a resistere a tutto, fuorché alle tentazioni','Oscar Wilde']
			,['Spesso sostengo lunghe conversazioni con me stesso e sono così intelligente che a volte non capisco nemmeno una parola di quello che dico','Oscar Wilde']
			,['Punteggiatura. Sono vivo e vegeto. Sono vivo. E vegeto.','Paolo Cananzi']
			,['Ho dei pensieri che non condivido','Pino Caruso']
			,['Il tipo di persona che ammirerei di più sarebbe quella che diventa estremamente brava a fare una serie di cose, ma che resta con il viso rigato di lacrime','Robert Oppenheimer']
			,['Lottavo contro il sonno, che è sempre un po’ ladro','Romain Gary']
			,['Non ammazzerei neanche una mosca io. Se non per legittima difesa, s\'intende','Sally Prudhomme']
			,['La differenza tra me e i surrealisti consiste nel fatto che io sono un surrealista','Salvador Dalì']
			,['Le ho chiesto di sposarmi e lei ha detto no. Da allora viviamo felici e contenti','Spike Milligan']
			,['È incredibile pensare che quando Mozart aveva la mia età era già morto da un anno','Tom Leherer']
			,['Non mi faccio domande perché non so che cosa rispondere','Tonino Guerra']
			,['Quel che ho detto ho detto! È qui lo nego','Totò']
			,['Faccio sempre ciò che non so fare, per imparare come va fatto','Vincent Van Gogh']
			,['L’insuccesso mi ha dato alla testa','Vittorio Gassman']
			,['Non ho alcun dubbio che ho meritato i miei nemici, ma non sono sicuro di aver meritato i miei amici','Walt Whitman']
			,['A scuola mi esclusero dalla squadra di scacchi a causa della mia statura','Woody Allen']
			,['Ho smesso di fumare. Vivrò una settimana di più e in quella settimana pioverà a dirotto','Woody Allen']
			,['Non è che ho paura di morire. È che non vorrei essere lì quando questo succede','Woody Allen']
			,['Sono stato picchiato, ma mi sono difeso bene. A uno di quelli gli ho rotto la mano: mi ci è voluta tutta la faccia, ma ce l\'ho fatta','Woody Allen']
			,['Venerdì mi sono svegliato e, siccome l\'universo si sta espandendo, mi ci è voluto più tempo del solito per trovare la vestaglia','Woody Allen']
			,['Ma è l’amore la più bella eutanasia che esista','Alda Merini']
			,['Rimuovo le antiche muraglie per trovare le praterie del sogno e incontrare te, pane incontaminato che prendo con le labbra. Sentire la tua lingua di bosco e l’ansia salina del tuo respiro, il cuore che si ferma è il battito delle ali di un’anima che forse se ne va per morire d’amore.','Alda Merini']
			,['Mi chiese cosa avrei portato su un\'isola deserta. Una barca e te dissi e la barca la bruciamo sulla spiaggia poi me ne andai lasciandola lì per tenermi il sogno','Jón Kalman Stefánsson']
			,['-- Alla vita -- La vita non è uno scherzo. / Prendila sul serio, come fa lo scoiattolo, ad esempio, / senza aspettarti nulla dal di fuori o nell\'al di là. / Non avrai altro da fare che vivere.','Nâzım Hikmet']
			,['Il più bello dei mari è quello che non navigammo. Il più bello dei nostri figli non è ancora cresciuto. I più belli dei nostri giorni non li abbiamo ancora vissuti. E quello che vorrei dirti di più bello non te l\'ho ancora detto.','Nâzım Hikmet']
			,['Mia rosa, pupilla dei miei occhi non ho paura di morire ma morire mi secca è una questione d\'amor proprio.','Nâzım Hikmet']
			,['-- Funchal -- (finale) ... Una bevanda effervescente in bicchieri vuoti. Un altoparlante che diffonde silenzio. Un sentiero che ricresce ad ogni passo. Un libro che può essere letto solo al buio.','Tomas Tranströmer']
			,['-- In questo mondo e accanto -- Alla giusta distanza dalla realtà.','Tomas Tranströmer']
			,['-- La tastiera muta -- Ho sognato che avevo disegnato tasti di pianoforte sul tavolo di cucina. Io ci suonavo sopra, erano muti. I vicini venivano ad ascoltare.','Tomas Tranströmer']
			,['-- La vita è un viaggio -- La strada non finisce mai. L’orizzonte corre in avanti.','Tomas Tranströmer']
			,['-- Preludium -- Il risveglio è un salto col paracadute dal sogno. Libero dal turbine soffocante il viaggiatore sprofonda verso lo spazio verde del mattino.','Tomas Tranströmer']
			,['-- Strofa e controstrofa -- Con la prua sollevata, in situazione senza speranza, sta il relitto di un sogno, nero contro la linea rosso chiaro della costa','Tomas Tranströmer']
			,['Liberi ma prudenti, come quando si sta in piedi su una imbarcazione stretta.','Tomas Tranströmer']
			,['...consideravano il minuscolo angolo di mondo dal quale provenivano come un semplice punto di partenza, ...','María Rosa Menocal']
		],
		
		//
		_xxx=function(){
			/*Input parameters:
				xxx	= 
			*/
/*TODO
*/
		},

		//RETURN <IMG> LOADING
		_imgLoading=function(){
			/*Input parameters:
				xxx	= 
			*/
			return $('<img/>',{
				'class':'samoLoading',
				'src':	'https://s.gr-assets.com/assets/loading.gif'
			});
		},



		//TOOLTIP BOOK: activate (for tooltip created "on the fly" with javascript)
		_tooltipBook_Activate=function(key){
			/*Input parameters:
				key	= tooltip key (corresponding to a DOM book id)
						ex: "bookCover877457_13155247"
			Return value:	true if tooltip with key was found; otherwise false
			*/
			var tooltip;
			//find tooltip element corresponding to a book
			for (var i=0;i<Tips.tips.length;i++){
				tooltip=Tips.tips[i];
				if (tooltip.element.id===key){
					tooltip.showDelayed();	//activate & show tooltip
					tooltip.hide();			//hide tooltip
					return true;
				}
			}
		},
		//TOOLTIP BOOK: replace data (for tooltip created "on the fly" with javascript)
		_tooltipBook_ReplaceData=function(key,bookLanguageData){
			/*Input parameters:
				key					= tooltip key (corresponding to a DOM book id)
										ex: "bookCover877457_13155247"
				bookLanguageData	= new book data to replace old's one
			*/
			var tooltip,el;
			//find tooltip element corresponding to this book
			for (var i=0;i<Tips.tips.length;i++){
				tooltip=Tips.tips[i];
				if (tooltip.element.id===key){
					el=$(tooltip.stemBox).find('div.tooltip.addbook > .content');
					//replace book info
					el.find('a.bookTitle')
					.prop('href',bookLanguageData.url)
					.html(bookLanguageData.title);
					break;
				}
			}

		},

		/**************************************************************************************************************
		******   REPLACE BOOK LIST IN LANGUAGE   **********************************************************************
		**************************************************************************************************************/
		//_booksListLanguage_data
		_BLLD={
			lang:'',
			total:0,
			totalSearched:0,
			totalReplaced:0,
			counterSearched:false,
			counterReplace:false,
			booksToReplace:[],
			hideNotFound:false,
			bookList:[]
		},
		_BLL_completeSearch=function(lang){
			_BLLD.counterReplaced.html(_BLLD.totalReplaced+'\\'+_BLLD.totalSearched+' replaced');
			//all books are searched
			if (_BLLD.total===_BLLD.totalSearched){
				_headerReplaceBook_Counters.find('.samoLoading').remove();	//remove loading image
				setTimeout(function(){
					_menuSamoButton.click();	//automatically open menu
				},3000);
			}
			//launch next search
			return _booksListLanguage_launchNextSearch();
		},
		//SHOW\HIDE BOOK NOT FOUND
		_BLL_visibility=function(hide){
			/*Input parameters:
				hide	= true if we need to hide book not found
			*/
			_BLLD.hideNotFound=hide;
			if (!_BLLD.bookList.length){return;}
			for (var i=0;i<_BLLD.bookList.length;i++){
				books=$(_BLLD.bookList[i].books);
				books.each(function(index){
					var book=$(this),
						bookAlreadyReplaced=book.data('samoLangEdition'),
						bookAlreadyReplaced_Data;
					//book already searched
					if (bookAlreadyReplaced && bookAlreadyReplaced.startsWith('SEARCH_COMPLETED')){	//ex: "SEARCH_COMPLETED|Italian|true"
						bookAlreadyReplaced_Data=bookAlreadyReplaced.split('|');
						//already searched for this language
						if (_BLLD.lang===bookAlreadyReplaced_Data[1]){
							//book in language NOT found
							if (bookAlreadyReplaced_Data[2]!=='true'){
								if (_BLLD.hideNotFound){
									book.hide('slow');
								}else{
									book.show('slow');
								}
							}
						//previous search in different language
						}else{
							book.show();
						}
					}
				});
			}
		},

		_booksListLanguage=function(lang){
			/*Input parameters:
				lang	= language to filter
			*/
			var bookList=[],	/*selectors of books to be replaced
									every element is a JSON
										{
											'books':'#xxx .yyy',	-> selector of books list
											'url':	'a'				-> selector, inside "books" single element, that identify url to book
										}
								*/
				books,
				CONCURRENT_BOOKS_IN_SEARCH=10;

			//reset counters
			_BLLD.lang=lang;
			_BLLD.total=0;
			_BLLD.totalSearched=0;
			_BLLD.totalReplaced=0;
			_BLLD.counterSearched=$('<div/>').appendTo(_headerReplaceBook_Counters);
			_BLLD.counterReplaced=$('<div/>',{'style':'color:red'}).appendTo(_headerReplaceBook_Counters);
			_BLLD.booksToReplace=[];
			_BLLD.lang=lang;

			//DEFINE DOM ELEMENTS CONTAINING BOOKS TO REPLACE
			switch (_pageType){
			case _PAGE_TYPE_BOOK:
				//readers also enjoyed
				bookList.push({
					'books':	'div[id^=relatedWorks-] div.bookCarousel ul>li',
					'url':		'a',
					'replace':{
						'links':'a',
//						'title':'a',
						'img':	'img'
					},
					'actions':{
						//activate tooltip in order to access data to be replaced
						'before':function(book,bookListData){
							_tooltipBook_Activate(book.prop('id'));
						},
						//replace data also on tooltip
						'replace':function(book,bookListData,bookLanguageData){
							_tooltipBook_ReplaceData(book.prop('id'),bookLanguageData);
						}
					}

				});
				//books by ...AUTHOR...
				bookList.push({
					'books':	'#aboutAuthor + div.bigBox div.bigBoxBody div[data-resource-type="Book"]',
					'url':		'>a',
					'replace':{
						'links':'>a,section.tooltip h2 a',
						'title':'section.tooltip h2 a',
						'img':	'>a img'
					},
					'actions':{
						//activate tooltip (inline) in order to access data to be replaced
						'before':function(book,bookListData){
							book.trigger('mouseover');	//activate inline tooltip
							book.trigger('mouseout');	//close inline tooltip
						}
					}
				});
				break;
			
			case _PAGE_TYPE_GOODREADS_CHOICE_AWARDS:
				//my books in nomination
				bookList.push({
					'books':	'#shelfNominees .shelfNominee',
					'url':		'a:not(.gcaMoreLink)',
					'replace':{
						'links':'a:not(.gcaMoreLink)',
						'title':'a.shelfNominee__title',
						'img':	'img'
					}
				});
				//categories
/*todo
non è possibile sostituire immagine del vincitore, in quanto non è presente il link al libro
				bookList.push({
					'books':	'#categories .categoryContainer .category',
					'url':		'a:not(.gcaMoreLink)',
					'replace':{
						'links':'',
						'title':'',
						'img':	'img.category__winnerImage'
					}
				});
*/
				break;

			case _PAGE_TYPE_GOODREADS_CHOICE_AWARDS_CATEGORY:
				//winnin book
				bookList.push({
					'books':	'.winningBook',
					'url':		'a:not(.gcaAuthor)',
					'replace':{
						'links':'a.winningTitle,.miniBookCover a',
						'title':'a.winningTitle',
						'img':	'.miniBookCover img'
					}
				});
				//all nominees
				bookList.push({
					'books':	'.pollContents .pollAnswer',
					'url':		'a.pollAnswer__bookLink',
					'replace':{
						'links':'',
						'title':'',
						'img':	'[id^=bookCover_] img'
					}
				});
				break;

			case _PAGE_TYPE_AUTHOR:
				//first books of author
				bookList.push({
					'books':	'[itemtype="https://schema.org/Collection"] table.tableList tr',
					'url':		'a.bookTitle',
					'replace':{
						'links':'a:not(.star)',
						'title':'a.bookTitle',
						'img':	'img.bookCover'
					}
				});
				break;

			case _PAGE_TYPE_AUTHOR_BOOKS:
				//books of author
				bookList.push({
					'books':'.leftContainer table.tableList tr',
					'url':	'a.bookTitle',
					'replace':{
						'links':'a:not(.star)',
						'title':'a.bookTitle',
						'img':	'img.bookCover'
					}
				});
				break;

			case _PAGE_TYPE_LIST:
				//books in this listopia
				bookList.push({
					'books':'#all_votes table.tableList tr',
					'url':	'a.bookTitle',
					'replace':{
						'links':'a:not(.star)',
						'title':'a.bookTitle',
						'img':	'img.bookCover'
					}
				});
				break;

			case _PAGE_TYPE_LIST_USERVOTES:
				//books in this listopia
				bookList.push({
					'books':'.leftContainer table.tableList tr',
					'url':	'a.bookTitle',
					'replace':{
						'links':'a:not(.star)',
						'title':'a.bookTitle',
						'img':	'img.bookCover'
					}
				});
				break;

			case _PAGE_TYPE_RECOMMENDATIONS:
				//books recommendations (view=covers)
				bookList.push({
					'books':'.recsListing .coverRow .bookBox',
					'url':	'div.coverWrapper a',
					'replace':{
						'links':'div.coverWrapper a',
//						'title':'a.bookTitle',
						'img':	'div.coverWrapper a img.bookImage'
					},
					'actions':{
						//activate tooltip in order to access data to be replaced
						'before':function(book,bookListData){
							_tooltipBook_Activate(book.find('>div.coverWrapper').prop('id'));
						},
						//replace data also on tooltip
						'replace':function(book,bookListData,bookLanguageData){
							_tooltipBook_ReplaceData(book.find('>div.coverWrapper').prop('id'),bookLanguageData);
						}
					}
				});
				//books recommendations (view=list)
				bookList.push({
					'books':'.recsListing .listViewBox .bookRow',
					'url':	'div.coverWrapper a',
					'replace':{
						'links':'div.coverWrapper a,div.bookInformation a.readable',
						'title':'div.bookInformation a.readable',
						'img':	'img.bookImage'
					}
				});
				break;

			case _PAGE_TYPE_FAVORITES_GENRES:
				//best books of the month, genre "History\Music\..."
				bookList.push({
					'books':'div.mainContent  div.leftContainer div.bigBoxContent > .art_book,div.mainContent  div.leftContainer div.bigBoxContent .bookBox',
					'url':	'div.coverWrapper a',
					'replace':{
						'links':'div.coverWrapper a',
						'title':'a.bookTitle',
						'img':	'div.coverWrapper a img.bookImage'
					},
					'actions':{
						//activate tooltip in order to access data to be replaced
						'before':function(book,bookListData){
							_tooltipBook_Activate(book.find('>div.coverWrapper').prop('id'));
						},
						//replace data also on tooltip
						'replace':function(book,bookListData,bookLanguageData){
							_tooltipBook_ReplaceData(book.find('>div.coverWrapper').prop('id'),bookLanguageData);
						}
					}
				});
				break;

			case _PAGE_TYPE_FAVORITES_GENRES_SPECIFIC:
				//new releases tagged "...", most read this week, popular "..." books, new releases by authors you've read
				bookList.push({
					'books':'div.mainContent  div.leftContainer div.coverBigBox div.bigBoxContent .bookBox',
					'url':	'div.coverWrapper a',
					'replace':{
						'links':'div.coverWrapper a',
						'title':'a.bookTitle',
						'img':	'div.coverWrapper a img.bookImage'
					},
					'actions':{
						//activate tooltip in order to access data to be replaced
						'before':function(book,bookListData){
							_tooltipBook_Activate(book.find('>div.coverWrapper').prop('id'));
						},
						//replace data also on tooltip
						'replace':function(book,bookListData,bookLanguageData){
							_tooltipBook_ReplaceData(book.find('>div.coverWrapper').prop('id'),bookLanguageData);
						}
					}
				});
				//lists
/*TODO
*/
				break;


/*TODO

			case xxxxxxx:
				break;
*/
			}

			//ITERATE BOOKS LISTS TO SEARCH FOR LANGUAGE EDITION
			_BLLD.bookList=bookList;	//save bookList searched
			if (!bookList.length){return _BLL_completeSearch();}
			for (var i=0;i<bookList.length;i++){
				books=$(bookList[i].books);
				_BLLD.total+=books.length;
				_BLLD.counterSearched.html(_BLLD.total+' books to search');	//counter
				books.each(function(index){
					var book=$(this),
						url=book.find(bookList[i].url).prop('href'),	//url of book page
						bookAlreadyReplaced=book.data('samoLangEdition'),
						bookAlreadyReplaced_Data;
					//book already searched
					if (bookAlreadyReplaced && bookAlreadyReplaced.startsWith('SEARCH_COMPLETED')){	//ex: "SEARCH_COMPLETED|Italian|true"
						bookAlreadyReplaced_Data=bookAlreadyReplaced.split('|');
						//already searched for this language
						if (lang===bookAlreadyReplaced_Data[1]){
//if (_BLLD.totalSearched==0){debugger;}
							//book in language found and replaced
							if (bookAlreadyReplaced_Data[2]==='true'){
								_BLLD.totalSearched++;
								_BLLD.totalReplaced++;
								_BLL_completeSearch();
								return true;
							}
						}
					}

					//SEARCH LANGUAGE EDITION FOR THIS BOOK
					//save data
					book.data({
						'samoLangEdition':	'SEARCHING',
//						'samoBookList':		JSON.stringify(bookList[i])
						'samoBookList':		bookList[i]
					});

					//save book to replace
					_BLLD.booksToReplace.push({url:url,book:book});

					//execute "before" actions
					if (bookList[i].actions && typeof bookList[i].actions.before==='function'){
						bookList[i].actions.before(book,bookList[i]);
					}
				});
			}
			if (!_BLLD.total){return _BLL_completeSearch();}
			//launch first search
			for (var i=0;i<_BLLD.booksToReplace.length;i++){
				_booksListLanguage_launchNextSearch();
				CONCURRENT_BOOKS_IN_SEARCH--;
				if (!CONCURRENT_BOOKS_IN_SEARCH){break;}
			}
		},
		_booksListLanguage_launchNextSearch=function(){
			var bookData;
			if (!_BLLD.booksToReplace.length){return;}
			//get book page, in order to retrieve the "book editions url"
			bookData=_BLLD.booksToReplace.shift();
			return _booksListLanguage_getBookPage(bookData.url,_BLLD.lang,bookData.book);
		},

		//REPLACE BOOK LIST IN LANGUAGE: get book page, in order to retrieve the "book editions url"
		_booksListLanguage_getBookPage=function(url,lang,book){
			/*Input parameters:
				url		= url of book page
				lang	= language to filter
				book	= jQuery element of book to be replaced
			*/
			$.ajax({
				type:	'GET',
				url:	url,
				success:function(data){
					var allEditions=$(data).find('.otherEditionsActions a').eq(0);
						urlEditions=allEditions.attr('href');

					//search first edition in language
					return _bookEditionsLanguage(urlEditions,lang,{
						returnFirstEdition:true,
						bookToReplace:book,
						callback:function(found,el,bookToReplace){
							/*Input parameters
								found			= true if book edition was found
								el				= DOM element of the book
								bookToReplace	= jQuery element of the book to be replaced
							*/
							var info,
								link,linkUrl,
								title,
								img,
								icon;
							_BLLD.totalSearched++;
//							console.log(_logPrefix+'REPLACE BOOK LIST IN LANGUAGE; found='+found+'; book '+url);
							bookToReplace.data('samoLangEdition','SEARCH_COMPLETED|'+lang+'|'+found);
							//language edition found
							if (found){
								link=el.find('a.bookTitle');
								linkUrl=link.attr('href');
								title=link.html();
//								info=JSON.parse(bookToReplace.data('samoBookList'));	//ex: "{"books":"[itemtype=\"https://schema.org/Collection\"] table.tableList tr","url":"a.bookTitle"}"
								info=bookToReplace.data('samoBookList');	//ex: "{"books":"[itemtype=\"https://schema.org/Collection\"] table.tableList tr","url":"a.bookTitle"}"
								//background effect: START
								bookToReplace.css({
									'-moz-transition':		'background-color 1s ease-in',
									'-webkit-transition':	'background-color 1s ease-in',
									'-o-transition':		'background-color 1s ease-in',
									'transition':			'background-color 1s ease-in'
								});
								bookToReplace.css('background-color','#e0e0c5');

								//add icon to this book that showing that this book was replaced
								icon=$('<div/>',{'style':'position:relative'})
								.append(
									$('<div/>').css({
										'position':'absolute',
										'top':'0',
										'left':'0',
										'border-radius':'12px',
										'background':'#e03636',
										'padding':'2px 5px',
										'color':'#fff',
										'font-size':'14px',
										'z-index':'1'
									})
									.html('&#8631;')
								);
								if (bookToReplace.find('>td').length){
									bookToReplace.find('>td').eq(0).prepend(icon);
								}else{
									bookToReplace.prepend(icon);
								}

								//REPLACE BOOK
								_BLLD.totalReplaced++;
								if (info.replace.links){
									bookToReplace.find(info.replace.links).prop('href',linkUrl);
								}
								if (info.replace.title){
									bookToReplace.find(info.replace.title).html(title);
								}
								if (info.replace.img){
									img=bookToReplace.find(info.replace.img)
									img.prop('src',el.find('> .leftAlignedImage img').prop('src'));
									if (_pageType===_PAGE_TYPE_GOODREADS_CHOICE_AWARDS_CATEGORY){
										img.height('221');	//fix image width
									}
								}
/*TODO
descrizione libro
*/

								//execute "replace" actions
								if (info.actions && typeof info.actions.replace==='function'){
									info.actions.replace(bookToReplace,info,{
										url:linkUrl,
										title:title
									});
								}

								//background effect: END
								setTimeout(function(){bookToReplace.css('background-color','inherit');},1000);

							//language edition not found
							}else{
								if (_BLLD.hideNotFound){
									bookToReplace.hide('slow');
								}
							}
							_BLL_completeSearch();
						}
					});


				},error:function(data){
					console.error(_logPrefix+'Error loading _booksListLanguage book',data);
					_BLLD.totalSearched++;
/*TODO
se è andata in errore la ricerca (mancata connessione)
_BLLD.counterReplaced.html(_BLLD.total+' italian books found');	//counter
*/
					_BLL_completeSearch();
				}
			});
		},

		/**************************************************************************************************************
		******   FIND OTHER BOOK EDIZIONS IN SPECIFIC LANGUAGE   *****************************************************************************************
		**************************************************************************************************************/
		_bookEditionsLanguage_Format=[],	//array of book formats found; ex: "paperback\ebook\audiobook..."
		_bookEditionsLanguage_FormatSelect=null,	//<select> of formats
		_bookEditionsLanguage_FormatFilter='',		//actual format filter selected
		_bookEditionsLanguage=function(url,lang,options){
			/*Input parameters:
				url		= url of allEditions
				lang	= language to filter
				options	= [optional] JSON with other params
										{
											'returnFirstEdition':	true,								-> true if this function must return to the "options.callback" parameter the DOM element for the first edition in language found
											'bookToReplace':		$(...)								-> DOM element of the book to be replaced
											'callback':				function(found,el,bookToReplace){}	-> callback function, that will be passed the book edition in language found
																												found			= true if book edition was found
																												el				= DOM element of the book
																												bookToReplace	= jQuery element of the book to be replaced
																											used only if options.returnFirstEdition=true
										}
			*/
			$.ajax({
				type:	'GET',
				url:	url,
				data:{
					expanded:		true,
					per_page:		100
				},
				success:function(data){
					var booksList=$(data).find('.workEditions'),
						books=booksList.find('.elementList'),
						nextPage=booksList.find('a.next_page'),
						results=_headerButton_BookEditionsLang,
						atLeastOneFound=false,
						pos,
						bookFormat;

					//remove loading image
					if (!options || (options && !options.returnFirstEdition)){
						results.find('.samoLoading').remove();
					}
					//search for book in language
					if (books.length){
						books.each(function(){
							var book=$(this),
								bookTitle,
								bookData=book.find('.editionData'),
								detailRows=bookData.find('.moreDetails .dataRow'),
								detailRow,
								title,value,
								validTitlesData=[
//									'Author(s)',
									'ISBN'
								],
								valid;
							for (var i=0;i<detailRows.length;i++){
								detailRow=detailRows.eq(i);
								title=detailRow.find('.dataTitle').html().trim().toUpperCase();
								//edition language info
								if (title.startsWith(('Edition language').toUpperCase())){
									value=detailRow.find('.dataValue').html().trim();

									//BOOK EDITION IN LANGUAGE
									if (value===lang){
										atLeastOneFound=true;
										//searching only for the first edition in language
										if (options && options.returnFirstEdition){
											options.callback(true,book,options.bookToReplace);
											return false;	//stop searching books edition (exit jquery each)
										}
										//add counter
										_bookEditionLanguageFound++;
										book
										.css('position','relative')
										.prepend(
											$('<div/>')
											.css({
												'position':		'absolute',
												'top':			'50%',
												'right':		'-21px',
												'transform':	'translate(0, -50%)',
												'border-radius':'15px',
												'padding':		'4px 5px',
												'background':	'#fff',
												'min-width':	'25px',
												'font-weight':	'bold'
											})
											.html(_bookEditionLanguageFound)
										);
										//adjust layout book
										book.find('.editionActions').remove();
										book.find('.detailsLink').remove();
										bookData.css({
											'float':		'left',
											'width':		'270px',
											'text-align':	'left'
										});
/*TODO
evidenziare eventuale libro che è la pagina attualmente aperta
*/
										//retrieve collection of "formmat for this edition"
										if (_bookEditionsLanguage_FormatSelect!==null){
											bookTitle=book.find('a.bookTitle').html();	//ex: "L'idiota (Paperback)" --> "Paperback"
											pos=bookTitle.lastIndexOf('(');
											if (pos===-1){
												bookFormat='_NOT DEFINED_';
											}else{
												bookFormat=bookTitle.substring(pos+1).replace(')','');
											}
											if (_bookEditionsLanguage_Format.indexOf(bookFormat)===-1){
												//add options to <select>
												_bookEditionsLanguage_FormatSelect
												.append($('<option/>',{'value':bookFormat}).html(bookFormat))
												.show();
												//add value to array
												_bookEditionsLanguage_Format.push(bookFormat);
											}
											book.data('format',bookFormat);	//add this info for filter purpose
											//check if user has already selected a filter format
debugger;
											if (_bookEditionsLanguage_FormatFilter && _bookEditionsLanguage_FormatFilter!==bookFormat){
												book.hide();
											}
										}
										//add edition book
										results.append(book);
									}
								}
								//remove other data
								valid=false;
								for (var k=0;k<validTitlesData.length;k++){
									if (title.startsWith(validTitlesData[k].toUpperCase())){
										valid=true;
										detailRow.find('div').css('display','inline');
									}
								}
								if  (!valid){detailRow.remove();}
							}
						});
						if (options && options.returnFirstEdition){
							if (atLeastOneFound){return;}
						}
						//more pages of book editions
						if (nextPage.length){
							if (!options || (options && !options.returnFirstEdition)){
								results.append(_imgLoading());
							}
							//search next page
							_bookEditionsLanguage(nextPage.attr('href'),lang,options);
						//no more book pages
						}else{
							if (!_bookEditionLanguageFound){
								if (options && options.returnFirstEdition){
									options.callback(false,false,options.bookToReplace);
								}else{
									results.append($('<div/>',{'style':'color:red;'}).html('No editions found for '+lang));
								}
							}
						}
					}else{
						if (!_bookEditionLanguageFound){
							if (options && options.returnFirstEdition){
								options.callback(false,false,options.bookToReplace);
							}else{
								results.append($('<div/>',{'style':'color:red;'}).html('No editions found for '+lang));
							}
						}
					}
				},error:function(data){
					console.error(_logPrefix+'Error loading _bookEditionsLanguage',data);
					if (options && options.returnFirstEdition){	//searching only for the first edition in language
						options.callback(false,false,options.bookToReplace);
					}else{
						if (!_bookEditionLanguageFound){
							results.append($('<div/>',{'style':'color:red;'}).html('Error retrieving data'));
						}
					}
				}
			});
		},


		/**************************************************************************************************************
		******   BOOKSHELVES VIEWER   *********************************************************************************
		**************************************************************************************************************/
		_BSD_shelfAnalyze=null,
		_BSD={	//Book Shelves Data; ex: {"searching":true,"searchingCounter":100,"searchingEl":{"0":{},"length":1,"prevObject":{"0":{},"length":1}},"readShelfUrl":"","books":[{"el":{"0":{},"context":{},"length":1},"shelves":["read","f_audiobook","g_novel-fantasy","p_rai-radio-3_ad-alta-voce","w_europa_russia","y_1800-1900"],"dateRead":"2019-01-18T23:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","g_assay","h_historic","h_true_story","my_favorites","o_biblioteca","p_e-o","w_europa_austria","w_europa_germania","w_europa_uk","y_1920-1939","y_1945-1970"],"dateRead":"2019-01-18T23:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","g_biography","h_historic","h_true_story","h_world_war_ii","my_favorites","o_biblioteca","p_bollati_boringhieri","w_europa_austria","w_europa_belgio","w_europa_francia","w_europa_germania","w_europa_polonia","y_1920-1939","y_1939-1945","y_1945-1970"],"dateRead":"2019-01-18T23:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","f_ebook","g_biography","h_historic","h_true_story","h_world_war_ii","my_favorites","o_biblioteca_mlol","p_mondadori","w_europa_germania","w_europa_ucraina","y_1900-1920","y_1920-1939","y_1939-1945","y_1945-1970","y_1970-2000"],"dateRead":"2019-01-15T23:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","f_audiobook","g_novel-fantasy","p_rai-radio-3_ad-alta-voce","w_asia_sud_bangladesh","w_asia_sud_india","w_europa_uk","y_1939-1945","y_1945-1970","y_1970-2000"],"dateRead":"2019-01-15T23:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","g_biography","h_true_story","o_biblioteca","p_ponte-alle-grazie","w_africa_algeria","w_africa_marocco","w_europa_francia","w_europa_svezia","y_1400-1500","y_1800-1900","y_1900-1920","y_1920-1939","y_1970-2000"],"dateRead":"2019-01-11T23:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","g_comics","g_novel-fantasy","o_biblioteca","p_logos"],"dateRead":"2019-01-09T23:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","g_novel-fantasy","my_favorites","o_biblioteca","p_einaudi","w_europa_francia","w_europa_spagna","y_1200-1300","y_1400-1500","y_1600-1700","y_1700-1800","y_1945-1970"],"dateRead":"2019-01-06T23:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","g_assay","h_historic","h_true_story","o_biblioteca_mlol","p_marsilio","w_africa_egitto","w_america_nord_usa_virginia","w_america_sud_perù","w_asia_ovest_israele","w_asia_ovest_turchia","w_asia_sud-est_indonesia","w_europa_austria","w_europa_cecoslovacchia","w_europa_francia","w_europa_germania","w_europa_italia","w_europa_lussemburgo","w_europa_olanda","w_europa_polonia","w_europa_portogallo","w_europa_russia","w_europa_spagna","w_europa_svezia","w_europa_svizzera","w_europa_ucraina","w_europa_uk","w_europa_ungheria","y_1500-1600","y_1600-1700","y_1700-1800"],"dateRead":"2019-01-04T23:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","f_audiobook","g_novel-fantasy","h_world_war_ii","my_favorites","p_rai-radio-3_ad-alta-voce","w_america_nord_usa_new_york","w_europa_polonia","y_1939-1945","y_1945-1970"],"dateRead":"2019-01-02T23:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","g_biography","g_comics","h_historic","h_true_story","o_biblioteca","p_hop_edizioni","w_america_nord_usa_california","w_europa_francia","w_europa_germania","w_europa_italia","w_europa_spagna","w_europa_svizzera","w_europa_uk","y_1800-1900","y_1900-1920","y_1920-1939","y_1939-1945","y_1945-1970","y_1970-2000"],"dateRead":"2019-01-02T23:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","g_assay","g_informatics","p_egea"],"dateRead":"2018-12-31T23:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","g_biography","h_historic","h_true_story","o_biblioteca","p_mondadori","w_europa_austria","w_europa_belgio","w_europa_cecoslovacchia","w_europa_danimarca","w_europa_francia","w_europa_germania","w_europa_italia","w_europa_olanda","w_europa_polonia","w_europa_portogallo","w_europa_spagna","w_europa_svezia","y_1600-1700"],"dateRead":"2018-12-31T23:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","g_comics","p_panini_comics","y_1970-2000"],"dateRead":"2018-12-29T23:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","g_novel-fantasy","h_historic","o_biblioteca","p_iperborea","w_europa_francia","y_1800-1900","y_1900-1920","y_1920-1939"],"dateRead":"2018-12-21T23:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","g_assay","h_historic","h_true_story","my_favorites","o_biblioteca","p_ponte-alle-grazie","w_america_nord_usa_alabama","w_america_nord_usa_arizona","w_america_nord_usa_california","w_america_nord_usa_carolina_del_nor","w_america_nord_usa_carolina_del_sud","w_america_nord_usa_colorado","w_america_nord_usa_georgia","w_america_nord_usa_louisiana","w_america_nord_usa_mississippi","w_america_nord_usa_ohio","w_america_nord_usa_pennsylvania","w_america_nord_usa_tennessee","w_asia_est_cina","w_asia_ovest_armenia","w_europa_francia","w_europa_germania","w_europa_irlanda","w_europa_russia","w_europa_uk","y_1400-1500","y_1700-1800","y_1800-1900","y_1900-1920","y_1920-1939"],"dateRead":"2018-12-12T23:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","f_audiobook","g_novel-fantasy","p_collina-d-oro","w_europa_svezia","y_1800-1900"],"dateRead":"2018-12-10T23:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","g_novel-fantasy","my_favorites","o_biblioteca","p_iperborea","w_europa_svezia","y_2020-2040"],"dateRead":"2018-12-03T23:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","g_novel-fantasy","o_biblioteca","p_iperborea","w_europa_danimarca","w_europa_francia","w_europa_germania","w_europa_svezia","y_1800-1900","y_1920-1939","y_1939-1945","y_1945-1970"],"dateRead":"2018-12-01T23:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","g_biography","h_true_story","o_biblioteca","p_iperborea","w_europa_svezia","y_1920-1939","y_1939-1945","y_1945-1970"],"dateRead":"2018-11-28T23:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","f_audiobook","g_biography","g_novel-fantasy","h_true_story","h_world_war_ii","p_rai-radio-3_ad-alta-voce","w_europa_belgio","w_europa_francia","w_europa_italia","y_1920-1939","y_1939-1945","y_1945-1970"],"dateRead":"2018-11-26T23:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","g_poetry","my_favorites","o_biblioteca","p_rizzoli","w_europa_svezia","y_1945-1970","y_1970-2000"],"dateRead":"2018-11-26T23:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","f_ebook","g_art","g_biography","g_novel-fantasy","h_true_story","o_biblioteca_mlol","p_mondadori_electa","w_europa_belgio","w_europa_francia","y_1800-1900","y_2000-2020"],"dateRead":"2018-11-24T23:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","g_assay","h_historic","p_quodlibet","w_america_nord_usa_massachussets","w_america_nord_usa_new_york","w_america_nord_usa_virginia","w_america_nord_usa_washington","w_europa_danimarca","w_europa_estonia","w_europa_francia","w_europa_germania","w_europa_italia","w_europa_polonia","w_europa_russia","w_europa_spagna","w_europa_uk","w_europa_ungheria","y_1700-1800","y_1800-1900","y_1900-1920","y_2000-2020"],"dateRead":"2018-11-24T23:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","g_poetry","o_biblioteca","p_crocetti","w_europa_svezia","y_1945-1970","y_1970-2000"],"dateRead":"2018-11-23T23:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","g_art","g_biography","g_comics","g_novel-fantasy","my_favorites","p_mondadori","w_africa_algeria","w_europa_francia","w_europa_uk","y_1800-1900","y_1900-1920"],"dateRead":"2018-11-23T23:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","g_biography","g_comics","h_historic","h_true_story","o_biblioteca","p_rizzoli","w_asia_sud_iran","w_europa_francia","y_1970-2000"],"dateRead":"2018-11-22T23:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","g_biography","g_comics","h_historic","h_true_story","o_biblioteca","p_rizzoli","w_europa_austria","y_1970-2000"],"dateRead":"2018-11-21T23:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","g_biography","g_comics","h_historic","h_true_story","p_rizzoli","w_asia_sud_iran","y_1970-2000"],"dateRead":"2018-11-20T23:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","g_biography","g_comics","h_historic","h_true_story","o_biblioteca","p_rizzoli","w_asia_ovest_turchia","w_asia_sud_iran","w_europa_italia","w_europa_spagna","y_1970-2000"],"dateRead":"2018-11-20T23:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","g_assay","h_historic","o_biblioteca","p_laterza","w_america_nord_usa_new_york","w_europa_belgio","w_europa_francia","w_europa_italia","y_-3500-0bc","y_0100-0500","y_0500-1000","y_1000-1100","y_1100-1200","y_1200-1300","y_1300-1400","y_1400-1500","y_1500-1600","y_1600-1700","y_1700-1800","y_1800-1900","y_1900-1920","y_1920-1939","y_1945-1970","y_1970-2000","y_2000-2020"],"dateRead":"2018-11-17T23:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","g_art","g_biography","h_true_story","my_favorites","p_skira","w_america_nord_usa_california","w_america_nord_usa_new_york","w_europa_francia","w_europa_germania","w_europa_polonia","w_europa_svizzera","y_1800-1900","y_1900-1920","y_1920-1939","y_1939-1945","y_1945-1970","y_1970-2000","y_2000-2020"],"dateRead":"2018-11-17T23:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","f_audiobook","g_novel-fantasy","p_feltrinelli","w_america_centrale_messico","y_1920-1939"],"dateRead":"2018-11-16T23:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","g_art","g_biography","h_true_story","o_biblioteca","p_astrolabio","w_europa_francia","y_1800-1900","y_1900-1920"],"dateRead":"2018-11-13T23:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","f_audiobook","g_biography","g_novel-fantasy","p_bompiani","w_europa_italia","y_1945-1970"],"dateRead":"2018-11-02T23:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","g_comics","my_favorites","p_panini_comics","y_1970-2000"],"dateRead":"2018-11-02T23:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","g_assay","g_biography","h_historic","h_true_story","o_biblioteca","p_einaudi","w_europa_francia","w_europa_spagna","y_1500-1600"],"dateRead":"2018-11-01T23:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","g_art","g_biography","g_photography","h_true_story","o_biblioteca","p_gruppo-editoriale-fabbri","y_1920-1939","y_1939-1945","y_1945-1970","y_1970-2000"],"dateRead":"2018-10-31T23:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","g_novel-fantasy","o_biblioteca","p_newton_compton","w_europa_russia","y_1920-1939"],"dateRead":"2018-10-31T23:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","f_ebook","g_biography","g_novel-fantasy","h_historic","h_true_story","o_biblioteca_mlol","p_adelphi","w_america_sud_brasile","w_asia_sud_india","w_europa_belgio","w_europa_finlandia","w_europa_francia","w_europa_germania","w_europa_norvegia","w_europa_polonia","w_europa_russia","w_europa_serbia","w_europa_slovacchia","w_europa_spagna","w_europa_svizzera","w_europa_ucraina","w_europa_uk","w_europa_ungheria","w_oceania_australia","y_1939-1945","y_1945-1970"],"dateRead":"2018-10-28T23:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","g_art","g_biography","g_photography","h_true_story","h_world_war_ii","o_biblioteca","p_hachette","w_africa_costa-d-avorio","w_america_centrale_cuba","w_america_centrale_messico","w_america_nord_canada","w_america_nord_usa_louisiana","w_america_nord_usa_massachussets","w_america_nord_usa_new_jersey","w_america_nord_usa_new_york","w_asia_est_cina","w_asia_est_giappone","w_asia_sud-est_birmania","w_asia_sud-est_indonesia","w_asia_sud_india","w_europa_francia","w_europa_germania","w_europa_italia","w_europa_russia","w_europa_spagna","y_1900-1920","y_1920-1939","y_1939-1945","y_1945-1970","y_1970-2000","y_2000-2020"],"dateRead":"2018-10-28T23:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","g_novel-fantasy","h_historic","h_world_war_ii","my_favorites","o_biblioteca","p_neri_pozza","w_america_nord_usa_florida","w_europa_russia","y_1939-1945","y_1970-2000"],"dateRead":"2018-10-27T22:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","g_assay","h_historic","h_true_story","my_favorites","o_biblioteca","p_sellerio","w_africa_algeria","w_africa_egitto","w_africa_libia","w_asia_ovest_arabia_saudita","w_asia_ovest_armenia","w_asia_ovest_iraq","w_asia_ovest_israele","w_asia_ovest_libano","w_asia_ovest_palestina","w_asia_ovest_turchia","w_asia_sud_iran","w_europa_albania","w_europa_austria","w_europa_bosnia_ed_erzegovina","w_europa_bulgaria","w_europa_cipro","w_europa_croazia","w_europa_francia","w_europa_germania","w_europa_grecia","w_europa_italia","w_europa_malta","w_europa_portogallo","w_europa_romania","w_europa_russia","w_europa_serbia","w_europa_spagna","w_europa_uk","w_europa_ungheria","y_1000-1100","y_1100-1200","y_1200-1300","y_1300-1400","y_1400-1500","y_1500-1600","y_1600-1700","y_1700-1800","y_1800-1900","y_1900-1920","y_1920-1939"],"dateRead":"2018-10-26T22:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","g_art","g_biography","o_biblioteca","p_mondadori_electa","w_europa_francia","y_1800-1900","y_1900-1920"],"dateRead":"2018-10-23T22:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","g_humor","o_biblioteca","p_baldini_castoldi","w_america_nord_usa_california","w_america_nord_usa_ohio","y_1800-1900"],"dateRead":"2018-10-22T22:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","f_ebook","g_biography","h_historic","h_true_story","my_favorites","o_biblioteca_mlol","p_mondadori","w_america_nord_usa_new_york","w_asia_ovest_iraq","w_asia_ovest_siria","w_europa_germania","w_europa_svizzera","y_1970-2000","y_2000-2020"],"dateRead":"2018-10-20T22:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","f_audiobook","g_novel-fantasy","p_bompiani","w_europa_italia","y_1920-1939"],"dateRead":"2018-10-19T22:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","g_biography","g_comics","g_novel-fantasy","h_faenza","h_true_story","o_biblioteca","p_coconino_press","w_africa_marocco","w_europa_italia","y_1970-2000","y_2000-2020"],"dateRead":"2018-10-19T22:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","f_ebook","g_novel-fantasy","h_historic","h_true_story","o_biblioteca_mlol","p_mondadori","w_europa_russia","y_1970-2000","y_2000-2020"],"dateRead":"2018-10-18T22:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","g_biography","g_comics","g_novel-fantasy","h_true_story","o_biblioteca","p_coconino_press","w_europa_italia","y_1939-1945","y_1970-2000","y_2000-2020"],"dateRead":"2018-10-15T22:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","f_audiobook","g_novel-fantasy","g_thriller_mystery-novel","p_adelphi","w_europa_italia","y_1970-2000"],"dateRead":"2018-10-13T22:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","g_assay","o_biblioteca","p_giunti"],"dateRead":"2018-10-13T22:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","g_comics","g_novel-fantasy","o_biblioteca","p_mondadori","w_europa_italia","y_1945-1970"],"dateRead":"2018-10-12T22:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","g_art","g_assay","h_historic","h_true_story","o_biblioteca","p_ponte-alle-grazie","w_africa_egitto","w_america_centrale_messico","w_america_centrale_rep-dominicana","w_america_nord_usa_california","w_asia_est_cina","w_asia_sud_afghanistan","w_asia_sud_india","w_asia_sud_iran","w_europa_francia","w_europa_germania","w_europa_grecia","w_europa_italia","w_europa_olanda","w_europa_polonia","w_europa_spagna","w_europa_svezia","w_europa_svizzera","w_europa_uk","y_-3500-0bc","y_0000-0100","y_0100-0500","y_0500-1000","y_1000-1100","y_1100-1200","y_1200-1300","y_1300-1400","y_1400-1500","y_1500-1600","y_1600-1700","y_1700-1800","y_1800-1900","y_1900-1920","y_1920-1939","y_1945-1970","y_1970-2000"],"dateRead":"2018-10-12T22:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","f_audiobook","g_novel-fantasy","p_mondadori","w_europa_germania","y_1939-1945","y_1945-1970"],"dateRead":"2018-10-10T22:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","g_biography","g_comics","g_photography","h_true_story","o_biblioteca","p_coconino_press","w_asia_sud_afghanistan","w_asia_sud_pakistan","w_europa_francia","y_1970-2000"],"dateRead":"2018-10-09T22:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","g_novel-fantasy","h_historic","h_world_war_ii","o_biblioteca","p_l-espresso","w_europa_francia","y_1939-1945"],"dateRead":"2018-10-07T22:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","g_art","g_biography","g_novel-fantasy","h_historic","o_biblioteca","p_neri_pozza","w_europa_italia","w_europa_uk","y_1600-1700"],"dateRead":"2018-10-06T22:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","f_audiobook","g_novel-fantasy","o_biblioteca_mlol","p_emons","w_europa_italia","y_1945-1970"],"dateRead":"2018-10-06T22:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","f_audiobook","g_novel-fantasy","g_thriller_mystery-novel","o_biblioteca_mlol","p_goodmood","w_europa_francia","w_europa_uk","y_1920-1939"],"dateRead":"2018-10-05T22:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","g_novel-fantasy","h_historic","h_world_war_ii","o_biblioteca","p_garzanti","w_america_nord_usa_new_york","w_europa_germania","w_europa_polonia","y_1939-1945","y_1945-1970","y_1970-2000"],"dateRead":"2018-10-05T22:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","f_audiobook","g_novel-fantasy","p_einaudi","w_america_nord_usa_new_york","y_1945-1970"],"dateRead":"2018-10-04T22:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","g_novel-fantasy","h_historic","my_favorites","o_biblioteca","p_big_sur","w_africa_benin","w_america_nord_usa_carolina_del_nor","w_america_nord_usa_carolina_del_sud","w_america_nord_usa_georgia","w_america_nord_usa_indiana","w_america_nord_usa_massachussets","w_america_nord_usa_new_york","w_america_nord_usa_tennessee","w_america_nord_usa_virginia","w_america_nord_usa_washington","y_1700-1800","y_1800-1900"],"dateRead":"2018-10-03T22:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","g_assay","o_biblioteca","p_adelphi","w_europa_germania","y_1800-1900"],"dateRead":"2018-09-21T22:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","g_art","g_biography","g_novel-fantasy","h_historic","o_biblioteca","p_mondadori","w_europa_italia","w_europa_malta","y_1500-1600","y_1600-1700","y_2000-2020"],"dateRead":"2018-09-17T22:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","g_novel-fantasy","h_historic","h_true_story","h_world_war_ii","my_favorites","o_biblioteca_mlol","p_sellerio","w_europa_germania","y_1939-1945","y_1945-1970"],"dateRead":"2018-09-15T22:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","f_audiobook","g_novel-fantasy","g_thriller_mystery-novel","o_biblioteca_mlol","p_goodmood","w_europa_uk","y_1945-1970"],"dateRead":"2018-09-08T22:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","g_biography","h_historic","h_true_story","h_world_war_ii","my_favorites","p_museo_statale_auschwitz_birkenau","w_europa_polonia","w_europa_slovacchia","y_1939-1945"],"dateRead":"2018-09-08T22:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","g_biography","h_historic","h_true_story","o_biblioteca","p_einaudi","w_africa_capo-verde","w_africa_mauritius","w_america_sud_argentina","w_america_sud_brasile","w_america_sud_cile","w_america_sud_ecuador","w_america_sud_isole-falkland","w_america_sud_paraguay","w_america_sud_perù","w_america_sud_uruguay","w_oceania_australia","w_oceania_nuova_zelanda","w_oceania_polinesia","y_1800-1900"],"dateRead":"2018-09-07T22:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","f_audiobook","g_novel-fantasy","g_thriller_mystery-novel","o_biblioteca_mlol","p_goodmood","w_europa_svizzera","w_europa_uk","y_1900-1920"],"dateRead":"2018-09-05T22:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","o_biblioteca","p_bao_publishing","w_europa_italia","y_2000-2020"],"dateRead":"2018-09-03T22:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","f_audiobook","g_novel-fantasy","g_thriller_mystery-novel","o_biblioteca_mlol","p_goodmood","w_europa_uk","y_1900-1920"],"dateRead":"2018-09-03T22:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","g_biography","g_comics","h_true_story","o_biblioteca","p_bao_publishing","w_europa_italia","y_2000-2020"],"dateRead":"2018-09-01T22:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","g_assay","h_historic","o_biblioteca","p_fazi","w_africa_egitto","w_africa_mauritania","w_africa_ruanda","w_asia_est_giappone","w_asia_ovest_arabia_saudita","w_asia_ovest_palestina","w_asia_ovest_siria","w_asia_ovest_turchia","w_asia_sud_iran","w_europa_francia","w_europa_germania","w_europa_grecia","w_europa_italia","w_europa_olanda","y_-3500-0bc","y_0000-0100","y_0100-0500","y_0500-1000","y_1300-1400","y_1600-1700","y_1700-1800","y_1800-1900","y_1920-1939","y_1939-1945","y_1970-2000","y_2000-2020"],"dateRead":"2018-09-01T22:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","f_audiobook","g_novel-fantasy","o_biblioteca_mlol","p_full-color-sound","w_america_nord_usa_new_york","y_1800-1900"],"dateRead":"2018-09-01T22:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","g_biography","g_comics","h_true_story","o_biblioteca","p_bao_publishing","w_europa_italia","y_1970-2000","y_2000-2020"],"dateRead":"2018-08-31T22:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","g_biography","g_comics","h_true_story","my_favorites","o_biblioteca","p_bao_publishing","w_europa_italia","y_1970-2000","y_2000-2020"],"dateRead":"2018-08-28T22:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","g_biography","g_comics","h_true_story","o_biblioteca","p_bao_publishing","w_europa_italia","y_1970-2000","y_2000-2020"],"dateRead":"2018-08-27T22:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","f_ebook","g_art","g_biography","h_true_story","my_favorites","o_biblioteca_mlol","p_edizioni_di_pagina","w_europa_francia","y_1800-1900","y_1900-1920"],"dateRead":"2018-08-27T22:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","f_audiobook","g_novel-fantasy","o_biblioteca_mlol","p_goodmood","w_europa_uk","y_1920-1939"],"dateRead":"2018-08-26T22:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","f_audiobook","g_novel-fantasy","o_biblioteca_mlol","p_goodmood","w_europa_uk","y_1920-1939"],"dateRead":"2018-08-24T22:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","g_novel-fantasy","o_biblioteca","p_casagrande","w_europa_ungheria","y_1939-1945","y_1945-1970"],"dateRead":"2018-08-22T22:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","g_biography","h_true_story","o_biblioteca","p_casagrande","w_europa_austria","w_europa_germania","w_europa_svizzera","w_europa_ungheria","y_1939-1945","y_1945-1970","y_1970-2000"],"dateRead":"2018-08-22T22:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","g_novel-fantasy","o_biblioteca","p_einaudi","y_1970-2000"],"dateRead":"2018-08-21T22:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","f_audiobook","g_novel-fantasy","p_bompiani","w_europa_russia","y_1900-1920","y_1920-1939"],"dateRead":"2018-08-21T22:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","g_novel-fantasy","o_biblioteca","p_einaudi","w_europa_svizzera","w_europa_ungheria","y_1939-1945","y_1945-1970"],"dateRead":"2018-08-21T22:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","f_audiobook","g_novel-fantasy","p_feltrinelli","w_europa_uk","y_1800-1900"],"dateRead":"2018-08-20T22:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","f_audiobook","g_novel-fantasy","p_adelphi","w_europa_italia","w_europa_portogallo","w_europa_spagna","y_1945-1970"],"dateRead":"2018-08-18T22:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","g_novel-fantasy","h_world_war_ii","my_favorites","o_biblioteca","p_einaudi","w_europa_ungheria","y_1939-1945","y_1945-1970","y_1970-2000"],"dateRead":"2018-08-17T22:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","g_assay","h_historic","h_true_story","h_world_war_i","h_world_war_ii","my_favorites","o_biblioteca","p_il_mulino","w_africa_algeria","w_africa_egitto","w_africa_etiopia","w_africa_libia","w_africa_marocco","w_africa_nigeria","w_africa_sudan","w_africa_sudan-del-sud","w_africa_tunisia","w_america_nord_usa_new_york","w_america_nord_usa_washington","w_asia_ovest_arabia_saudita","w_asia_ovest_armenia","w_asia_ovest_azerbaigian","w_asia_ovest_emirati-arabi-uniti","w_asia_ovest_giordania","w_asia_ovest_iraq","w_asia_ovest_israele","w_asia_ovest_kuwait","w_asia_ovest_libano","w_asia_ovest_palestina","w_asia_ovest_siria","w_asia_ovest_turchia","w_asia_ovest_yemen","w_asia_sud_afghanistan","w_asia_sud_india","w_asia_sud_iran","w_europa_albania","w_europa_austria","w_europa_bosnia_ed_erzegovina","w_europa_bulgaria","w_europa_francia","w_europa_grecia","w_europa_italia","w_europa_montenegro","w_europa_olanda","w_europa_russia","w_europa_serbia","w_europa_spagna","w_europa_svizzera","w_europa_uk","w_europa_ungheria","y_1700-1800","y_1800-1900","y_1900-1920","y_1920-1939","y_1939-1945","y_1945-1970","y_1970-2000","y_2000-2020"],"dateRead":"2018-08-14T22:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","g_art","g_biography","g_novel-fantasy","h_historic","h_true_story","my_favorites","o_biblioteca","p_einaudi","w_africa_capo-verde","w_america_centrale_panama","w_america_sud_perù","w_europa_danimarca","w_europa_francia","w_europa_uk","w_oceania_polinesia","y_1800-1900","y_1900-1920"],"dateRead":"2018-08-11T22:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","f_audiobook","g_novel-fantasy","p_einaudi","w_europa_italia","y_1920-1939"],"dateRead":"2018-08-04T22:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","g_assay","h_historic","o_biblioteca","p_il_mulino","w_africa_benin","w_africa_camerun","w_africa_ciad","w_africa_egitto","w_africa_etiopia","w_africa_guinea","w_africa_kenya","w_africa_madagascar","w_africa_nigeria","w_africa_sudafrica","w_africa_tanzania","w_africa_togo","w_america_centrale_guatemala","w_america_centrale_messico","w_america_nord_canada","w_america_nord_groenlandia","w_america_nord_usa_alaska","w_america_nord_usa_montana","w_america_sud_argentina","w_america_sud_brasile","w_america_sud_cile","w_america_sud_perù","w_asia_centrale_uzbekistan","w_asia_est_cina","w_asia_ovest_georgia","w_asia_ovest_israele","w_asia_ovest_siria","w_asia_ovest_turchia","w_asia_sud-est_indonesia","w_asia_sud-est_laos","w_asia_sud-est_malesia","w_asia_sud_india","w_asia_sud_iran","w_europa_germania","w_europa_grecia","w_europa_italia","w_europa_romania","w_europa_russia","w_europa_spagna","w_europa_uk","w_europa_ungheria","w_oceania_australia","w_oceania_melanesia","w_oceania_polinesia","y_-0x0-3500bc","y_-3500-0bc","y_0500-1000","y_1500-1600","y_1600-1700","y_1700-1800","y_1800-1900","y_1920-1939","y_1945-1970","y_1970-2000","y_2000-2020"],"dateRead":"2018-08-04T22:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","f_audiobook","g_biography","g_novel-fantasy","p_adelphi","w_europa_francia","w_europa_germania","w_europa_grecia","w_europa_italia","w_europa_olanda","y_1900-1920"],"dateRead":"2018-07-30T22:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","g_novel-fantasy","h_historic","p_einaudi","w_asia_ovest_turchia","w_europa_francia","w_europa_germania","w_europa_italia","w_europa_olanda","w_europa_svizzera","w_europa_uk","y_1500-1600"],"dateRead":"2018-07-28T22:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","f_ebook","g_novel-fantasy","o_biblioteca_mlol","p_adelphi","w_europa_austria","y_1900-1920"],"dateRead":"2018-07-28T22:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","g_assay","h_historic","h_true_story","my_favorites","o_biblioteca","p_mondadori","w_africa_algeria","w_africa_angola","w_africa_capo-verde","w_africa_congo","w_africa_gambia","w_africa_ghana","w_africa_guinea","w_africa_marocco","w_africa_senegal","w_america_centrale_barbados","w_america_centrale_belize","w_america_centrale_cuba","w_america_centrale_giamaica","w_america_centrale_guatemala","w_america_centrale_messico","w_america_centrale_nicaragua","w_america_centrale_panama","w_america_centrale_rep-dominicana","w_america_nord_canada","w_america_nord_usa_carolina_del_nor","w_america_nord_usa_carolina_del_sud","w_america_nord_usa_connecticut","w_america_nord_usa_florida","w_america_nord_usa_georgia","w_america_nord_usa_illinois","w_america_nord_usa_iowa","w_america_nord_usa_louisiana","w_america_nord_usa_maine","w_america_nord_usa_maryland","w_america_nord_usa_massachussets","w_america_nord_usa_new_york","w_america_nord_usa_pennsylvania","w_america_nord_usa_texas","w_america_nord_usa_virginia","w_america_nord_usa_washington","w_america_nord_usa_wisconsin","w_america_sud_argentina","w_america_sud_bolivia","w_america_sud_brasile","w_america_sud_cile","w_america_sud_colombia","w_america_sud_ecuador","w_america_sud_guyana_francese","w_america_sud_guyana_inglese","w_america_sud_perù","w_america_sud_suriname","w_america_sud_venezuela","w_asia_est_cina","w_asia_est_corea_del_nord","w_asia_est_corea_del_sud","w_asia_est_giappone","w_asia_est_macao","w_asia_ovest_israele","w_asia_ovest_libano","w_asia_sud-est_filippine","w_asia_sud-est_laos","w_asia_sud-est_malesia","w_asia_sud-est_thailandia","w_asia_sud-est_vietnam","w_asia_sud_india","w_asia_sud_sri-lanka","w_europa_belgio","w_europa_danimarca","w_europa_francia","w_europa_irlanda","w_europa_italia","w_europa_olanda","w_europa_portogallo","w_europa_spagna","w_europa_svezia","w_europa_svizzera","w_europa_uk","y_1300-1400","y_1400-1500","y_1500-1600","y_1600-1700","y_1700-1800","y_1800-1900","y_1900-1920","y_1920-1939","y_1945-1970","y_1970-2000","y_2000-2020"],"dateRead":"2018-07-27T22:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","g_comics","h_historic","o_biblioteca","p_carocci","w_europa_cecoslovacchia","w_europa_francia","w_europa_germania","w_europa_italia","w_europa_olanda","w_europa_svizzera","w_europa_uk","y_1600-1700","y_1700-1800"],"dateRead":"2018-07-24T22:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","g_biography","g_comics","h_historic","my_favorites","o_biblioteca","p_rizzoli","w_asia_ovest_israele","w_asia_ovest_libano","w_europa_olanda","y_1970-2000","y_2000-2020"],"dateRead":"2018-07-23T22:00:00.000Z"},{"el":{"0":{},"context":{},"length":1},"shelves":["read","g_assay","h_historic","h_true_story","o_biblioteca","p_feltrinelli","w_america_sud_argentina","y_1970-2000"],"dateRead":"2018-07-21T22:00:00.000Z"}],"visibleColumns":["checkbox","position","cover","title","author","isbn","isbn13","asin","num_pages","avg_rating","num_ratings","date_pub","date_pub_edition","rating","shelves","review","notes","recommender","comments","votes","read_count","date_started","date_read","date_added","date_purchased","owned","purchase_location","condition","format","actions"],"columnsHeader":{"0":{},"length":1,"prevObject":{"0":{},"length":1,"prevObject":{"0":{},"length":1,"prevObject":{"0":{},"1":{},"2":{},"3":{},"4":{},"5":{},"6":{},"7":{},"8":{},"9":{},"10":{},"11":{},"12":{},"13":{},"14":{},"15":{},"16":{},"17":{},"18":{},"19":{},"20":{},"21":{},"22":{},"23":{},"24":{},"25":{},"26":{},"27":{},"28":{},"29":{},"30":{},"31":{},"32":{},"33":{},"34":{},"35":{},"36":{},"37":{},"38":{},"39":{},"40":{},"41":{},"42":{},"43":{},"44":{},"45":{},"46":{},"47":{},"48":{},"49":{},"50":{},"51":{},"52":{},"53":{},"54":{},"55":{},"56":{},"57":{},"58":{},"59":{},"60":{},"61":{},"62":{},"63":{},"64":{},"65":{},"66":{},"67":{},"68":{},"69":{},"70":{},"71":{},"72":{},"73":{},"74":{},"75":{},"76":{},"77":{},"78":{},"79":{},"80":{},"81":{},"82":{},"83":{},"84":{},"85":{},"86":{},"87":{},"88":{},"89":{},"90":{},"91":{},"92":{},"93":{},"94":{},"95":{},"96":{},"97":{},"98":{},"99":{},"100":{},"101":{},"102":{},"103":{},"104":{},"105":{},"106":{},"107":{},"108":{},"109":{},"110":{},"111":{},"112":{},"113":{},"114":{},"115":{},"116":{},"117":{},"118":{},"119":{},"120":{},"121":{},"122":{},"123":{},"124":{},"125":{},"length":126},"selector":"#books"},"selector":"#books #booksHeader"}},"shelves":{"read":{"2018":87,"2019":13,"tot":100},"f_audiobook":{"2018":21,"2019":3,"tot":24},"g_novel-fantasy":{"2018":46,"2019":5,"tot":51},"p_rai-radio-3_ad-alta-voce":{"2018":1,"2019":3,"tot":4},"w_europa_russia":{"2018":11,"2019":2,"tot":13},"y_1800-1900":{"2018":25,"2019":3,"tot":28},"g_assay":{"2018":13,"2019":3,"tot":16},"h_historic":{"2018":32,"2019":6,"tot":38},"h_true_story":{"2018":34,"2019":7,"tot":41},"my_favorites":{"2018":19,"2019":5,"tot":24},"o_biblioteca":{"2018":51,"2019":7,"tot":58},"p_e-o":{"2019":1,"tot":1},"w_europa_austria":{"2018":5,"2019":4,"tot":9},"w_europa_germania":{"2018":19,"2019":6,"tot":25},"w_europa_uk":{"2018":20,"2019":4,"tot":24},"y_1920-1939":{"2018":23,"2019":5,"tot":28},"y_1945-1970":{"2018":27,"2019":7,"tot":34},"g_biography":{"2018":33,"2019":5,"tot":38},"h_world_war_ii":{"2018":9,"2019":3,"tot":12},"p_bollati_boringhieri":{"2019":1,"tot":1},"w_europa_belgio":{"2018":5,"2019":2,"tot":7},"w_europa_francia":{"2018":28,"2019":6,"tot":34},"w_europa_polonia":{"2018":6,"2019":4,"tot":10},"y_1939-1945":{"2018":20,"2019":5,"tot":25},"f_ebook":{"2018":6,"2019":1,"tot":7},"o_biblioteca_mlol":{"2018":15,"2019":2,"tot":17},"p_mondadori":{"2018":7,"2019":2,"tot":9},"w_europa_ucraina":{"2018":1,"2019":2,"tot":3},"y_1900-1920":{"2018":20,"2019":3,"tot":23},"y_1970-2000":{"2018":33,"2019":4,"tot":37},"w_asia_sud_bangladesh":{"2019":1,"tot":1},"w_asia_sud_india":{"2018":6,"2019":1,"tot":7},"p_ponte-alle-grazie":{"2018":2,"2019":1,"tot":3},"w_africa_algeria":{"2018":4,"2019":1,"tot":5},"w_africa_marocco":{"2018":3,"2019":1,"tot":4},"w_europa_svezia":{"2018":8,"2019":3,"tot":11},"y_1400-1500":{"2018":5,"2019":2,"tot":7},"g_comics":{"2018":17,"2019":2,"tot":19},"p_logos":{"2019":1,"tot":1},"p_einaudi":{"2018":9,"2019":1,"tot":10},"w_europa_spagna":{"2018":11,"2019":4,"tot":15},"y_1200-1300":{"2018":3,"2019":1,"tot":4},"y_1600-1700":{"2018":9,"2019":3,"tot":12},"y_1700-1800":{"2018":11,"2019":2,"tot":13},"p_marsilio":{"2019":1,"tot":1},"w_africa_egitto":{"2018":5,"2019":1,"tot":6},"w_america_nord_usa_virginia":{"2018":3,"2019":1,"tot":4},"w_america_sud_perù":{"2018":4,"2019":1,"tot":5},"w_asia_ovest_israele":{"2018":5,"2019":1,"tot":6},"w_asia_ovest_turchia":{"2018":6,"2019":1,"tot":7},"w_asia_sud-est_indonesia":{"2018":2,"2019":1,"tot":3},"w_europa_cecoslovacchia":{"2018":1,"2019":2,"tot":3},"w_europa_italia":{"2018":30,"2019":3,"tot":33},"w_europa_lussemburgo":{"2019":1,"tot":1},"w_europa_olanda":{"2018":8,"2019":2,"tot":10},"w_europa_portogallo":{"2018":3,"2019":2,"tot":5},"w_europa_svizzera":{"2018":11,"2019":2,"tot":13},"w_europa_ungheria":{"2018":9,"2019":1,"tot":10},"y_1500-1600":{"2018":8,"2019":1,"tot":9},"w_america_nord_usa_new_york":{"2018":11,"2019":1,"tot":12},"p_hop_edizioni":{"2019":1,"tot":1},"w_america_nord_usa_california":{"2018":4,"2019":1,"tot":5},"g_informatics":{"2019":1,"tot":1},"p_egea":{"2019":1,"tot":1},"w_europa_danimarca":{"2018":4,"2019":1,"tot":5},"p_panini_comics":{"2018":2,"tot":2},"p_iperborea":{"2018":4,"tot":4},"w_america_nord_usa_alabama":{"2018":1,"tot":1},"w_america_nord_usa_arizona":{"2018":1,"tot":1},"w_america_nord_usa_carolina_del_nor":{"2018":3,"tot":3},"w_america_nord_usa_carolina_del_sud":{"2018":3,"tot":3},"w_america_nord_usa_colorado":{"2018":1,"tot":1},"w_america_nord_usa_georgia":{"2018":3,"tot":3},"w_america_nord_usa_louisiana":{"2018":3,"tot":3},"w_america_nord_usa_mississippi":{"2018":1,"tot":1},"w_america_nord_usa_ohio":{"2018":2,"tot":2},"w_america_nord_usa_pennsylvania":{"2018":2,"tot":2},"w_america_nord_usa_tennessee":{"2018":2,"tot":2},"w_asia_est_cina":{"2018":5,"tot":5},"w_asia_ovest_armenia":{"2018":3,"tot":3},"w_europa_irlanda":{"2018":2,"tot":2},"p_collina-d-oro":{"2018":1,"tot":1},"y_2020-2040":{"2018":1,"tot":1},"g_poetry":{"2018":2,"tot":2},"p_rizzoli":{"2018":6,"tot":6},"g_art":{"2018":12,"tot":12},"p_mondadori_electa":{"2018":2,"tot":2},"y_2000-2020":{"2018":20,"tot":20},"p_quodlibet":{"2018":1,"tot":1},"w_america_nord_usa_massachussets":{"2018":4,"tot":4},"w_america_nord_usa_washington":{"2018":4,"tot":4},"w_europa_estonia":{"2018":1,"tot":1},"p_crocetti":{"2018":1,"tot":1},"w_asia_sud_iran":{"2018":8,"tot":8},"p_laterza":{"2018":1,"tot":1},"y_-3500-0bc":{"2018":4,"tot":4},"y_0100-0500":{"2018":3,"tot":3},"y_0500-1000":{"2018":4,"tot":4},"y_1000-1100":{"2018":3,"tot":3},"y_1100-1200":{"2018":3,"tot":3},"y_1300-1400":{"2018":5,"tot":5},"p_skira":{"2018":1,"tot":1},"p_feltrinelli":{"2018":3,"tot":3},"w_america_centrale_messico":{"2018":5,"tot":5},"p_astrolabio":{"2018":1,"tot":1},"p_bompiani":{"2018":3,"tot":3},"g_photography":{"2018":3,"tot":3},"p_gruppo-editoriale-fabbri":{"2018":1,"tot":1},"p_newton_compton":{"2018":1,"tot":1},"p_adelphi":{"2018":6,"tot":6},"w_america_sud_brasile":{"2018":4,"tot":4},"w_europa_finlandia":{"2018":1,"tot":1},"w_europa_norvegia":{"2018":1,"tot":1},"w_europa_serbia":{"2018":3,"tot":3},"w_europa_slovacchia":{"2018":2,"tot":2},"w_oceania_australia":{"2018":3,"tot":3},"p_hachette":{"2018":1,"tot":1},"w_africa_costa-d-avorio":{"2018":1,"tot":1},"w_america_centrale_cuba":{"2018":2,"tot":2},"w_america_nord_canada":{"2018":3,"tot":3},"w_america_nord_usa_new_jersey":{"2018":1,"tot":1},"w_asia_est_giappone":{"2018":3,"tot":3},"w_asia_sud-est_birmania":{"2018":1,"tot":1},"p_neri_pozza":{"2018":2,"tot":2},"w_america_nord_usa_florida":{"2018":2,"tot":2},"p_sellerio":{"2018":2,"tot":2},"w_africa_libia":{"2018":2,"tot":2},"w_asia_ovest_arabia_saudita":{"2018":3,"tot":3},"w_asia_ovest_iraq":{"2018":3,"tot":3},"w_asia_ovest_libano":{"2018":4,"tot":4},"w_asia_ovest_palestina":{"2018":3,"tot":3},"w_europa_albania":{"2018":2,"tot":2},"w_europa_bosnia_ed_erzegovina":{"2018":2,"tot":2},"w_europa_bulgaria":{"2018":2,"tot":2},"w_europa_cipro":{"2018":1,"tot":1},"w_europa_croazia":{"2018":1,"tot":1},"w_europa_grecia":{"2018":6,"tot":6},"w_europa_malta":{"2018":2,"tot":2},"w_europa_romania":{"2018":2,"tot":2},"g_humor":{"2018":1,"tot":1},"p_baldini_castoldi":{"2018":1,"tot":1},"w_asia_ovest_siria":{"2018":4,"tot":4},"h_faenza":{"2018":1,"tot":1},"p_coconino_press":{"2018":3,"tot":3},"g_thriller_mystery-novel":{"2018":5,"tot":5},"p_giunti":{"2018":1,"tot":1},"w_america_centrale_rep-dominicana":{"2018":2,"tot":2},"w_asia_sud_afghanistan":{"2018":3,"tot":3},"y_0000-0100":{"2018":2,"tot":2},"w_asia_sud_pakistan":{"2018":1,"tot":1},"p_l-espresso":{"2018":1,"tot":1},"p_emons":{"2018":1,"tot":1},"p_goodmood":{"2018":6,"tot":6},"p_garzanti":{"2018":1,"tot":1},"p_big_sur":{"2018":1,"tot":1},"w_africa_benin":{"2018":2,"tot":2},"w_america_nord_usa_indiana":{"2018":1,"tot":1},"p_museo_statale_auschwitz_birkenau":{"2018":1,"tot":1},"w_africa_capo-verde":{"2018":3,"tot":3},"w_africa_mauritius":{"2018":1,"tot":1},"w_america_sud_argentina":{"2018":4,"tot":4},"w_america_sud_cile":{"2018":3,"tot":3},"w_america_sud_ecuador":{"2018":2,"tot":2},"w_america_sud_isole-falkland":{"2018":1,"tot":1},"w_america_sud_paraguay":{"2018":1,"tot":1},"w_america_sud_uruguay":{"2018":1,"tot":1},"w_oceania_nuova_zelanda":{"2018":1,"tot":1},"w_oceania_polinesia":{"2018":3,"tot":3},"p_bao_publishing":{"2018":5,"tot":5},"p_fazi":{"2018":1,"tot":1},"w_africa_mauritania":{"2018":1,"tot":1},"w_africa_ruanda":{"2018":1,"tot":1},"p_full-color-sound":{"2018":1,"tot":1},"p_edizioni_di_pagina":{"2018":1,"tot":1},"p_casagrande":{"2018":2,"tot":2},"h_world_war_i":{"2018":1,"tot":1},"p_il_mulino":{"2018":2,"tot":2},"w_africa_etiopia":{"2018":2,"tot":2},"w_africa_nigeria":{"2018":2,"tot":2},"w_africa_sudan":{"2018":1,"tot":1},"w_africa_sudan-del-sud":{"2018":1,"tot":1},"w_africa_tunisia":{"2018":1,"tot":1},"w_asia_ovest_azerbaigian":{"2018":1,"tot":1},"w_asia_ovest_emirati-arabi-uniti":{"2018":1,"tot":1},"w_asia_ovest_giordania":{"2018":1,"tot":1},"w_asia_ovest_kuwait":{"2018":1,"tot":1},"w_asia_ovest_yemen":{"2018":1,"tot":1},"w_europa_montenegro":{"2018":1,"tot":1},"w_america_centrale_panama":{"2018":2,"tot":2},"w_africa_camerun":{"2018":1,"tot":1},"w_africa_ciad":{"2018":1,"tot":1},"w_africa_guinea":{"2018":2,"tot":2},"w_africa_kenya":{"2018":1,"tot":1},"w_africa_madagascar":{"2018":1,"tot":1},"w_africa_sudafrica":{"2018":1,"tot":1},"w_africa_tanzania":{"2018":1,"tot":1},"w_africa_togo":{"2018":1,"tot":1},"w_america_centrale_guatemala":{"2018":2,"tot":2},"w_america_nord_groenlandia":{"2018":1,"tot":1},"w_america_nord_usa_alaska":{"2018":1,"tot":1},"w_america_nord_usa_montana":{"2018":1,"tot":1},"w_asia_centrale_uzbekistan":{"2018":1,"tot":1},"w_asia_ovest_georgia":{"2018":1,"tot":1},"w_asia_sud-est_laos":{"2018":2,"tot":2},"w_asia_sud-est_malesia":{"2018":2,"tot":2},"w_oceania_melanesia":{"2018":1,"tot":1},"y_-0x0-3500bc":{"2018":1,"tot":1},"w_africa_angola":{"2018":1,"tot":1},"w_africa_congo":{"2018":1,"tot":1},"w_africa_gambia":{"2018":1,"tot":1},"w_africa_ghana":{"2018":1,"tot":1},"w_africa_senegal":{"2018":1,"tot":1},"w_america_centrale_barbados":{"2018":1,"tot":1},"w_america_centrale_belize":{"2018":1,"tot":1},"w_america_centrale_giamaica":{"2018":1,"tot":1},"w_america_centrale_nicaragua":{"2018":1,"tot":1},"w_america_nord_usa_connecticut":{"2018":1,"tot":1},"w_america_nord_usa_illinois":{"2018":1,"tot":1},"w_america_nord_usa_iowa":{"2018":1,"tot":1},"w_america_nord_usa_maine":{"2018":1,"tot":1},"w_america_nord_usa_maryland":{"2018":1,"tot":1},"w_america_nord_usa_texas":{"2018":1,"tot":1},"w_america_nord_usa_wisconsin":{"2018":1,"tot":1},"w_america_sud_bolivia":{"2018":1,"tot":1},"w_america_sud_colombia":{"2018":1,"tot":1},"w_america_sud_guyana_francese":{"2018":1,"tot":1},"w_america_sud_guyana_inglese":{"2018":1,"tot":1},"w_america_sud_suriname":{"2018":1,"tot":1},"w_america_sud_venezuela":{"2018":1,"tot":1},"w_asia_est_corea_del_nord":{"2018":1,"tot":1},"w_asia_est_corea_del_sud":{"2018":1,"tot":1},"w_asia_est_macao":{"2018":1,"tot":1},"w_asia_sud-est_filippine":{"2018":1,"tot":1},"w_asia_sud-est_thailandia":{"2018":1,"tot":1},"w_asia_sud-est_vietnam":{"2018":1,"tot":1},"w_asia_sud_sri-lanka":{"2018":1,"tot":1},"p_carocci":{"2018":1,"tot":1}},"shelvesNames":["f_audiobook","f_ebook","g_art","g_assay","g_biography","g_comics","g_humor","g_informatics","g_novel-fantasy","g_photography","g_poetry","g_thriller_mystery-novel","h_faenza","h_historic","h_true_story","h_world_war_i","h_world_war_ii","my_favorites","o_biblioteca","o_biblioteca_mlol","p_adelphi","p_astrolabio","p_baldini_castoldi","p_bao_publishing","p_big_sur","p_bollati_boringhieri","p_bompiani","p_carocci","p_casagrande","p_coconino_press","p_collina-d-oro","p_crocetti","p_e-o","p_edizioni_di_pagina","p_egea","p_einaudi","p_emons","p_fazi","p_feltrinelli","p_full-color-sound","p_garzanti","p_giunti","p_goodmood","p_gruppo-editoriale-fabbri","p_hachette","p_hop_edizioni","p_il_mulino","p_iperborea","p_l-espresso","p_laterza","p_logos","p_marsilio","p_mondadori","p_mondadori_electa","p_museo_statale_auschwitz_birkenau","p_neri_pozza","p_newton_compton","p_panini_comics","p_ponte-alle-grazie","p_quodlibet","p_rai-radio-3_ad-alta-voce","p_rizzoli","p_sellerio","p_skira","read","w_africa_algeria","w_africa_angola","w_africa_benin","w_africa_camerun","w_africa_capo-verde","w_africa_ciad","w_africa_congo","w_africa_costa-d-avorio","w_africa_egitto","w_africa_etiopia","w_africa_gambia","w_africa_ghana","w_africa_guinea","w_africa_kenya","w_africa_libia","w_africa_madagascar","w_africa_marocco","w_africa_mauritania","w_africa_mauritius","w_africa_nigeria","w_africa_ruanda","w_africa_senegal","w_africa_sudafrica","w_africa_sudan","w_africa_sudan-del-sud","w_africa_tanzania","w_africa_togo","w_africa_tunisia","w_america_centrale_barbados","w_america_centrale_belize","w_america_centrale_cuba","w_america_centrale_giamaica","w_america_centrale_guatemala","w_america_centrale_messico","w_america_centrale_nicaragua","w_america_centrale_panama","w_america_centrale_rep-dominicana","w_america_nord_canada","w_america_nord_groenlandia","w_america_nord_usa_alabama","w_america_nord_usa_alaska","w_america_nord_usa_arizona","w_america_nord_usa_california","w_america_nord_usa_carolina_del_nor","w_america_nord_usa_carolina_del_sud","w_america_nord_usa_colorado","w_america_nord_usa_connecticut","w_america_nord_usa_florida","w_america_nord_usa_georgia","w_america_nord_usa_illinois","w_america_nord_usa_indiana","w_america_nord_usa_iowa","w_america_nord_usa_louisiana","w_america_nord_usa_maine","w_america_nord_usa_maryland","w_america_nord_usa_massachussets","w_america_nord_usa_mississippi","w_america_nord_usa_montana","w_america_nord_usa_new_jersey","w_america_nord_usa_new_york","w_america_nord_usa_ohio","w_america_nord_usa_pennsylvania","w_america_nord_usa_tennessee","w_america_nord_usa_texas","w_america_nord_usa_virginia","w_america_nord_usa_washington","w_america_nord_usa_wisconsin","w_america_sud_argentina","w_america_sud_bolivia","w_america_sud_brasile","w_america_sud_cile","w_america_sud_colombia","w_america_sud_ecuador","w_america_sud_guyana_francese","w_america_sud_guyana_inglese","w_america_sud_isole-falkland","w_america_sud_paraguay","w_america_sud_perù","w_america_sud_suriname","w_america_sud_uruguay","w_america_sud_venezuela","w_asia_centrale_uzbekistan","w_asia_est_cina","w_asia_est_corea_del_nord","w_asia_est_corea_del_sud","w_asia_est_giappone","w_asia_est_macao","w_asia_ovest_arabia_saudita","w_asia_ovest_armenia","w_asia_ovest_azerbaigian","w_asia_ovest_emirati-arabi-uniti","w_asia_ovest_georgia","w_asia_ovest_giordania","w_asia_ovest_iraq","w_asia_ovest_israele","w_asia_ovest_kuwait","w_asia_ovest_libano","w_asia_ovest_palestina","w_asia_ovest_siria","w_asia_ovest_turchia","w_asia_ovest_yemen","w_asia_sud-est_birmania","w_asia_sud-est_filippine","w_asia_sud-est_indonesia","w_asia_sud-est_laos","w_asia_sud-est_malesia","w_asia_sud-est_thailandia","w_asia_sud-est_vietnam","w_asia_sud_afghanistan","w_asia_sud_bangladesh","w_asia_sud_india","w_asia_sud_iran","w_asia_sud_pakistan","w_asia_sud_sri-lanka","w_europa_albania","w_europa_austria","w_europa_belgio","w_europa_bosnia_ed_erzegovina","w_europa_bulgaria","w_europa_cecoslovacchia","w_europa_cipro","w_europa_croazia","w_europa_danimarca","w_europa_estonia","w_europa_finlandia","w_europa_francia","w_europa_germania","w_europa_grecia","w_europa_irlanda","w_europa_italia","w_europa_lussemburgo","w_europa_malta","w_europa_montenegro","w_europa_norvegia","w_europa_olanda","w_europa_polonia","w_europa_portogallo","w_europa_romania","w_europa_russia","w_europa_serbia","w_europa_slovacchia","w_europa_spagna","w_europa_svezia","w_europa_svizzera","w_europa_ucraina","w_europa_uk","w_europa_ungheria","w_oceania_australia","w_oceania_melanesia","w_oceania_nuova_zelanda","w_oceania_polinesia","y_-0x0-3500bc","y_-3500-0bc","y_0000-0100","y_0100-0500","y_0500-1000","y_1000-1100","y_1100-1200","y_1200-1300","y_1300-1400","y_1400-1500","y_1500-1600","y_1600-1700","y_1700-1800","y_1800-1900","y_1900-1920","y_1920-1939","y_1939-1945","y_1945-1970","y_1970-2000","y_2000-2020","y_2020-2040"],"years":{"2018":87,"2019":13}}
			shelvesAnalyze:[	//array of shelves that can be viewed
				{
					name:'Read',	//name as showed in "Shelf list" (left section of My Books page)
					shelf:'read',
					sort:'date_read',
					yearLabel:'date read',
					booksNumber:0
				},{
					name:'Want to Read',	//name as showed in "Shelf list" (left section of My Books page)
					shelf:'to-read',
					sort:'date_added',
					yearLabel:'date added',
					booksNumber:0
				}
			],
			shelfAnalyzeCurrent:{},	//pointer to "shelvesAnalyze" array of the shelf currently analyzed
		},

		//BOOKSHELVES VIEWER: execute
		_bookshelvesViewer=function(shelfAnalyzeIndex){
			/*Input parameters:
				shelfAnalyzeIndex	= index for "shelvesAnalyze" array of the shelf we want to analyze
			*/
			if (_BSD.searching){return;}
			//INITIALIZE SEARCH
			_BSD.shelfAnalyzeCurrent=_BSD.shelvesAnalyze[shelfAnalyzeIndex];
			_BSD.searching=true;
			_BSD.searchingCounter=0;
			_BSD.pagesTot=0;
			_BSD.pagesCompleted=0;
			_BSD.searchesPageToLaunch=[];//array of "page" to launch to get ALL read books (page "1" stand for book 1-100, page "2" stand for book 101-200)
			_BSD.booksPerPage={};	//temporary JSON of book element and shelves (after retrieving all pages, they are moved to "books" variable)
			_BSD.books=[];			//array of book element and shelves
			_BSD.visibleColumns=[];	//column names visible
			_BSD.columnsHeader=null;
			_BSD.shelves={};			//all shelves data
			_BSD.shelvesNames=[];	//all shelves names (for sorting purpose)
			_BSD.years={};			//years in book
			//DOM cache
			_BSD.bookShowed=null;
			_BSD.shelvesList=null;
			_BSD.shelvesA=null;
			_BSD.yearContainer=null;
			_BSD.yearA=null;
			_BSD.booksContainer=null;
			_BSD.booksRows=null;
			_BSD.readShelfUrl=$('div.siteHeader > div').data('reactProps').myBooksUrl;	//ex: "/review/list/35318441"
			_BSD.searchingEl=null;

			//identify list of pages to get, and launch searches simultaneously
			_bookshelvesViewer_getBooksNumber();
			if (_BSD.shelfAnalyzeCurrent.booksNumber){

				_BSD.searchingEl=$('<div/>',{'style':'color:red'}).appendTo(_headerBookshelves_Counters);

				//total number of pages
				_BSD.pagesTot=Math.floor(_BSD.shelfAnalyzeCurrent.booksNumber / 100) + (_BSD.shelfAnalyzeCurrent.booksNumber % 100===0 ? 0 : 1);	//ex: 11
				for (var i=1;i<=_BSD.pagesTot;i++){	//from page 1 to end
					_BSD.searchesPageToLaunch.push(i);
					_BSD.booksPerPage[i]=[];	//initialize books array for this page
				}
				//start searching next books pages
				for (var i=0,uI=_BSD.searchesPageToLaunch.length;i<uI;i++){
					_bookshelvesViewer_search(_BSD.searchesPageToLaunch.shift());
					if (i===10){break;}	//maximum 10 pages simultaneously
				}
			}
			if (!_BSD.pagesTot){
				_headerBookshelves_Counters.find('.samoLoading').remove();
				_headerBookshelves_Counters.append($('<div/>',{'style':'color:red'}).html('Unable to retrieve list of '+_BSD.shelfAnalyzeCurrent.name+' pages'));
				_BSD.searching=false;
			}
		},


		//BOOKSHELVES VIEWER: get books number for shelves to analyze
		_bookshelvesViewer_getBooksNumber=function(){
			/*Input parameters:
				?	= 
			*/
			var allShelvesBooksCounted=true;
			//check if we have already get books number for all shelves to analyze
			for (var i=0;i<_BSD.shelvesAnalyze.length;i++){	//check if we already had retrieved books number
				if (!_BSD.shelvesAnalyze[i].booksNumber){
					allShelvesBooksCounted=false;
					break;
				}
			}
			if (allShelvesBooksCounted){return true;}

			//SEARCH BOOKS NUMBER
			$('#paginatedShelfList .userShelf > a:not(.multiLink)').each(function(index,el){
				var shelf=jQuery(el).html(),	//ex: "Read  ‎(1003)"	ATTENTION, there is a "&lrm;" after the name
					shelfEl=shelf.split('(');	//['Want to Read ','519)']
				//remove character "&lrm;" after shelf name (the split function has replaced "&lrm;" with "")
				shelfEl[0]=shelfEl[0].slice(0,shelfEl[0].length-1).trim();
				//book numbers for shelves to analyzed
				for (var i=0;i<_BSD.shelvesAnalyze.length;i++){
					if (shelfEl[0]===_BSD.shelvesAnalyze[i].name){	//ex: "Read"
						_BSD.shelvesAnalyze[i].booksNumber=+shelfEl[1].replace(')','');	//ex: 1003
					}
				}
			});
		},

		//BOOKSHELVES VIEWER: search
		_bookshelvesViewer_search=function(page){
			/*Input parameters:
				page	= [optional] number page
			*/
			return $.ajax({
				type:	'GET',
				url:	_BSD.readShelfUrl,
				data:{
					shelf:		_BSD.shelfAnalyzeCurrent.shelf,	//ex: "read"
					view:		'table',
					sort:		_BSD.shelfAnalyzeCurrent.sort,	//ex: "date_read"
//					order:		'a',	//ascending
					order:		'd',	//descending
					per_page:	100,
					page:		page
				},
				success:function(data){
					var myBooksPage=$(data),
						booksList=myBooksPage.find('#books'),
						pagination=myBooksPage.find('#reviewPagination').last(),
						lastPage;

					//GET COLUMN CONFIGURATIONS
					if (_BSD.columnsHeader===null){	//only first time
						_BSD.columnsHeader=booksList.find('#booksHeader').clone();
						_BSD.columnsHeader.find('th').each(function(){
							var column=$(this),
								classes=this.className.split(/\s+/),
								text='';
							//get visible columns
							for (var i=0;i<classes.length;i++){
								if (classes[i]!=='header'
								&& classes[i]!=='field'
								){
/*TODO
bisogna aggiungere "if" che sia visibile in questo momento
*/
									_BSD.visibleColumns.push(classes[i]);
								}
							}

							//remove original "changing sort" links
							column.find('a').each(function(){
								if (text){text+='<br>'}
								text+=$(this).html();
							});
							column.empty().append(text);
							//add new "changing sort" links
/*TODO
*/
						});
					}
					//analize data
					booksList.find('#booksBody tr').each(function(){
						var el=$(this),
							book={
								'el':el,
								'shelves':[],
								'dateRead':'',
								'dateAdded':''
							},
							dateRead=el.find('td.date_read .date_read_value').html(),	//ex: "Sep 13, 2018"
							dateAdded=el.find('td.date_added div.value span').html(),	//ex: "Sep 13, 2018"
							year=0,
							extractDate=function(key,dateValue){
								var dateSplit=dateValue.split(' ');
								if (dateSplit.length<3){
									//fix for date "first of the month"; ex: "Sep 2018"
									dateValue=dateSplit[0]+' 1, '+dateSplit[1];
								}
								try {
									book[key]=new Date(Date.parse(dateValue));
								}catch(error){
									console.error(error,dateValue,book[key]);
									_debugLog('_bookshelvesViewer '+key+' not found',dateValue,book[key],el,year);
								}
							};

						//counter
						_BSD.searchingEl.html(++_BSD.searchingCounter+' calculated books');
						//get date read, date added
						if (dateRead){dateRead=extractDate('dateRead',dateRead);}
						if (dateAdded){dateAdded=extractDate('dateAdded',dateAdded);}
						//identify the year for this book
						if (_BSD.shelfAnalyzeCurrent.shelf==='read'){
							if (book['dateRead']){year=book['dateRead'].getFullYear();}
						}else{
							if (book['dateAdded']){year=book['dateAdded'].getFullYear();}
						}
						_BSD.years[year]=(_BSD.years[year] || 0)+1;

						//get shelves for this book
						el.find('td.shelves').find('a.shelfLink').each(function(){
							var shelf=$(this).text();
							book.shelves.push(shelf);

							//CALCULATE SHELVES COUNTER
							//total
							if (!(shelf in _BSD.shelves)){
								_BSD.shelves[shelf]={'tot':0};
								_BSD.shelvesNames.push(shelf);
							}
							_BSD.shelves[shelf]['tot']=_BSD.shelves[shelf]['tot']+1;
							//total by year
							_BSD.shelves[shelf][year]=(_BSD.shelves[shelf][year] || 0)+1;
						});
						//add data-attribute to element
						el.data({
							'date-read':	book['dateRead'],
							'date-added':	book['dateAdded'],
							'year':			year,
							'shelves':		book.shelves
						})
						//cache book data
						_BSD.booksPerPage[page].push(book);
					});
					//all searches done
					_BSD.pagesCompleted++;	//update counter of pages completed
					if (_BSD.pagesCompleted===_BSD.pagesTot){
						//move all data from _BSD.booksPerPage to _BSD.books (because one page from goodreads can return data before another called before, but we want books sorted)
						for (var i=1;i<=_BSD.pagesTot;i++){
							for (var k=0;k<_BSD.booksPerPage[i].length;k++){
								_BSD.books.push(_BSD.booksPerPage[i][k]);
							}
						}
						//init layout
						return _bookshelvesViewer_layoutInit();
					}else{
						//if there are other pages to retrieve
						if (_BSD.searchesPageToLaunch.length){
							//load next book page list
							return _bookshelvesViewer_search(_BSD.searchesPageToLaunch.shift());
						}
					}
				},error:function(data){
					console.error(_logPrefix+'Error loading __bookshelvesViewer',data);
					_BSD.searching=false;
					_headerBookshelves_Counters.find('.samoLoading').remove()
					_headerBookshelves_Counters.append($('<div/>',{'style':'color:red;'}).html('Error retrieving data'));
				}
			});
		},

		//BOOKSHELVES VIEWER: layout initialization
		_bookshelvesViewer_layoutInit=function(){
			/*Input parameters:
				?	= 
			*/
			var head=$('head'),
				style=[
					'.samoHidden{',
						'display: none !important;',
					'}',
					'a.samoFilterYear{',
						'background: #f4f1ea;',
						'margin: 6px 12px 0 0;',
						'padding: 2px 0px 1px 6px;',
						'border-radius: 6px;',
						'color: #da1515;',
						'display: inline-block;',
						'font-weight: bold;',
						'-moz-transition: all 1s ease-in;',
						'-webkit-transition: all 1s ease-in;',
						'-o-transition: all 1s ease-in;',
						'transition: all 1s ease-in;',
					'}',
					'a.samoFilterYear.selected{',
						'background: #00635d;',
						'color: #fff;',
						'font-weight: normal !important;',
					'}',
					'span.samoShelfCounter{',
						'background: #e0e0c5;',
						'color: #5a2121;',
						'padding: 3px 4px 2px;',
						'border-radius: 6px;',
						'margin-left: 5px;',
						'font-size: 12px;',
					'}',
					'div.userShelf a{',
						'padding: 2px 0px 1px 6px;',
						'border-radius: 6px;',
					'}',
					'div.userShelf a.selected{',
						'background: #00635d;',
						'color: #fff;',
					'}',
					'#controls div.samoExcludeShelves{',
						'float: left;',
						'margin-right: -30px;',
						'padding: 2px;',
						'color: #00635d;',
						'font-weight: bold;',
					'}',
					'#controls div.samoExcludeShelves > div > div{',
						'display: inline-block;',
						'font-weight: normal;',
					'}',
					'#controls div.samoExcludeShelves > div > div input{',
						'width: 30px;',
						'margin-left: 2px;',
						'margin-right: 5px;',
					'}',
					'#booksBody > tr td.field.actions .samoCounter{',
						'position: absolute;',
						'top: 50%;',
						'right: -2px;',
						'transform: translate(0px, -50%);',
						'border-radius: 15px;',
						'padding: 4px 7px;',
						'background: #00635d;',
						'color: #fff;',
					'}'
				],
				header=$('#header'),
				controls=$('#controls'),
				controlsExcludeInputs,
				leftCol=$('#leftCol'),
				rightCol=$('#rightCol'),
				filterYear,yearsArray=[],year,
				shelvesContainer=$('#shelvesSection'),
				shelvesHeader=shelvesContainer.find('.sectionHeader'),
				booksTable=$('#books'),
				shelfExclude,shelfExcludeField;

			//STYLE
			if (!head.find('style[data-samo]').length){
				head.append('<style type="text/css" data-samo="true">'+style.join('')+'</style>');
			}

			//HEADER
			//remove Bookshelf currently opened title (if present), and replace with number of books showed; ex: "Read (xxx)"
			_BSD.bookShowed=header.find('.h1Shelf').empty();
			if (!_BSD.bookShowed.length){
				_BSD.bookShowed=$('<span/>',{'class':'h1Shelf'}).appendTo(header.find('h1'));
			}
			_BSD.bookShowed.html(_BSD.books.length+' '+_BSD.shelfAnalyzeCurrent.name).css('padding-right','5px');
			//search book: remove original version and add new one
			controls.find('.myBooksSearch').empty();
/*TODO
	search
		modificare
*/
			//remove links "Batch edit, Stats, Print, View mode" (remaining only "Settings")
			controls.find('a:not(#shelfSettingsLink)').remove();
			//add "Exclude shelves"
			controlsExcludeInputs=controls.find('div.samoExcludeShelves > div > div input');
			if (!controls.find('div.samoExcludeShelves').length){
				controls.prepend(
					$('<div/>',{'class':'samoExcludeShelves'})
					.append('Exlude shelves')
					.append(
						$('<div/>')
						.append(
							$('<div/>').append('starts with').append($('<input/>',{'type':'text','class':'starts'}))
						)
						.append(
							$('<div/>').append('contains').append($('<input/>',{'type':'text','class':'contains'}))
						)
						.append(
							$('<div/>').append('ends with').append($('<input/>',{'type':'text','class':'ends'}))
						)
					)
				);
				controlsExcludeInputs=controls.find('div.samoExcludeShelves > div > div input');
				controlsExcludeInputs.change(function(){
					var exclude,el,shelf;
					//exclude\hide shelves
					for (var i=0;i<_BSD.shelvesA.length;i++){
						exclude=false;
						el=$(_BSD.shelvesA[i]);
						shelf=el.data('name');
						controlsExcludeInputs.each(function(index,input){
							var who=input.className,
								input=$(input),
								value=input.val().trim().toLowerCase();
							if (value!==''){
								if (who==='starts'){
									if (shelf.startsWith(value)){exclude=true;return false;}
								}else if (who==='contains'){
									if (shelf.indexOf(value)>-1){exclude=true;return false;}
								}else if (who==='ends'){
									if (shelf.endsWith(value)){exclude=true;return false;}
								}
							}
						});
						if (exclude){
							el.addClass('samoHidden')
						}else{
							el.removeClass('samoHidden')
						}
					}
				});
			}
			//"Settings" tooltip cleaner
			$('#otherFields').remove();	//"Per page, Sort"

			//LEFT PART: BOOKSHELVES
			//remove original leftpart
			shelvesHeader.find('a').remove();	//"Edit bookshelves" link
			shelvesContainer.find('a').remove();	//"All" shelf link
			_BSD.shelvesList=shelvesContainer.find('#paginatedShelfList').removeClass('stacked').empty();	//remove original bookshelves
			leftCol.find('.stacked').remove();	//remove stacked shelves ("Add shelf")
			//shelf names replace
			if (!shelvesHeader.find('input').length){
				shelvesHeader
				.prepend(
					$('<div/>',{'style':'display: table;'})
					.append($('<span/>',{'style':'float: right;font-weight: normal;'}).html('Display shelf name'))
					.append($('<span/>',{'style':'float: right;font-weight: normal;font-size:10px;'}).html('(pattern: "search|replace,...")'))
					.append(

						//REPLACE SHELVES NAME
						$('<input/>',{'type':'text','style':'float: right;width: 120px;'})
						.val(samoGoodreadsUtility['shelvesNames'] || '')
						.change(function(){
							//iudentify rules
							var namesRules=$(this).val().split(',')	//ex: ["toread-|","toread_|"]
											.map(function(namesRule){
												if (namesRule===''){return {}};
												namesRule=namesRule.split('|');	//ex: ["toread-","|"]
												return {
													'search':	new RegExp(namesRule[0],'g'),
													'replace':	namesRule[1] || ''
												};
											}),
								el,
								shelf;
							for (var i=0;i<_BSD.shelvesA.length;i++){
								//calculate new name
								el=$(_BSD.shelvesA[i]);
								shelf=el.data('name');
								for (var k=0;k<namesRules.length;k++){
									if ('search' in namesRules[k]){
										shelf=shelf.replace(namesRules[k]['search'],namesRules[k]['replace']);
									}
								}
								//replace new name
								el.find('span').eq(0).html(shelf);
							}
						})
					)
				)
			}
			//compose bookshelves list
			_BSD.shelvesNames.sort(function(a,b){
				//shelf with priority
				var priority={
						'read':			1,
						'to-read':		2,
						'my_favorites':	3
					};
				if (a in priority){
					if (b in priority){
						return priority[a]-priority[b];
					}
					return -1;
				}else if (b in priority){
					return 1;
				}
				//ascending alphabetically
				if (a < b) {return -1;}
				if (a > b) {return 1;}
				return 0;
			});
			_bookshelvesViewer_displayShelves();
			//exclude shelves
			if (samoGoodreadsUtility['excludeShelves']){
				for (var shelf in samoGoodreadsUtility['excludeShelves']){
					if (shelf===_BSD.shelfAnalyzeCurrent.shelf){	//ex: "to-read"
						shelfExclude=samoGoodreadsUtility['excludeShelves'][shelf];
						for (var who in shelfExclude){
							if (shelfExclude[who]){
								shelfExcludeField=who==='s' ? 'starts'
												: who==='c' ? 'contains'
												: who==='e' ? 'ends' : '';
								controlsExcludeInputs.filter('.'+shelfExcludeField).val(shelfExclude[who]);
							}
						}
					}
				}
				controlsExcludeInputs.eq(0).change();
			}

			//RIGHT PART: BOOKS AND YEARS FILTERS
/*TODO
aggiungere tasto "reset filters (show all)"
*/
			//replace pagination with year filter
			filterYear=$('<div/>');
			for (var year in _BSD.years){
				yearsArray.push(year);
			}
			yearsArray.sort(function(a, b){return b-a});	//descending
			for (var i=0;i<yearsArray.length;i++){
				year=yearsArray[i]
				filterYear.append(
					$('<a/>',{'class':'samoFilterYear','data-year':year})
					.append(year)
					.append(_bookshelvesViewer_layoutAddCounter(_BSD.years[year]))
					.click(function(){
						_bookshelvesViewer_clickFilter($(this));
					})
				);
			}
			_BSD.yearA=filterYear.find('a');
			_BSD.yearContainer=rightCol.find('#reviewPagination');
			_BSD.yearContainer.empty().append(' ').append('Years ('+_BSD.shelfAnalyzeCurrent.yearLabel+'):').append(filterYear);
			_BSD.yearContainer.parent().removeClass('right');
			
			//set header book list
			booksTable.find('#booksHeader').empty().append(_BSD.columnsHeader.html());
			//remove original book
			_BSD.booksContainer=booksTable.find('#booksBody').empty();
			//show books
			_bookshelvesViewer_displayBooks();
			
			//FOOTER
			//remove "per page, sort, RSS, pagination"
			$('#pagestuff').remove();

			//SEARCH BUTTON CONCLUSION
			_BSD.searching=false
			_headerBookshelves_Counters.find('.samoLoading').remove();	//remove loading image
			setTimeout(function(){
				_menuSamoButton.click();	//automatically open menu
			},500);
		},

		//BOOKSHELVES VIEWER: display shelves
		_bookshelvesViewer_displayShelves=function(){
			/*Input parameters:
				?	= 
			*/
			var shelf;
			for (var i=0;i<_BSD.shelvesNames.length;i++){
				shelf=_BSD.shelvesNames[i];
/*TODO
visualizzazione a tree?
la libreria "read" si potrebbe spostare sopra a filtri years
*/
				_BSD.shelvesList.append(
					$('<div/>',{
						'class':'userShelf',
						'title':_bookshelvesViewer_tooltipShelvesYearText(_BSD.shelves[shelf])
					})
					.append(
						$('<a/>',{
							'class':	shelf.length>21 ? 'longShelf' : '',
							'data-name':shelf
						})
						.append($('<span/>').html(shelf))
						.append(_bookshelvesViewer_layoutAddCounter(_BSD.shelves[shelf]['tot']))
						.click(function(){
							_bookshelvesViewer_clickFilter($(this));
						})
					)
				);
			}
			_BSD.shelvesA=_BSD.shelvesList.find('a');
		},
		
		//BOOKSHELVES VIEWER: construct text to be used on tooltip over shelves
		_bookshelvesViewer_tooltipShelvesYearText=function(shelvesData){
			/*Input parameters:
				shelvesData	= JSON with year books counter for this shelf; ex: {"2018":21,"2019":3,"tot":24}
			*/
			var t='';
			for (var year in shelvesData){
				if (year!=='tot'){
					if (t){t+=', ';}
					t+=year+'='+shelvesData[year];
				}
			}
			return t;
		},

		//BOOKSHELVES VIEWER: display books
		_bookshelvesViewer_displayBooks=function(){
			/*Input parameters:
				?	= 
			*/
			var book;
			for (var i=0;i<_BSD.books.length;i++){
				book=_BSD.books[i].el;
				//add sequence book number
				book.find('td.field.actions').css('position','relative')
				.prepend(
					$('<div/>',{'class':'samoCounter'}).html(_BSD.books.length-i)
				);
				//add book to list
				_BSD.booksContainer.append(book);
			}
			_BSD.booksRows=_BSD.booksContainer.find('>tr');	//cache DOM
			_BSD.books=null;	//empty memory
		},

		//BOOKSHELVES VIEWER: display books
		_bookshelvesViewer_filterBooks=function(){
			/*Input parameters:
				?	= 
			*/
			var book,
				shelves,dateRead,dateAdded,year,
				filters={	//filters applied
					years:	_BSD.yearA.filter('.selected'),
					shelves:_BSD.shelvesA.filter('.selected')
				},
				ok,okNumber=0,
				filterYear,filterShelves,
				el,
				shelf,foundNumber,
				counters={'years':{},'shelves':{}};	//shelves counters for this filters
			for (var i=0;i<_BSD.booksRows.length;i++){
				book=$(_BSD.booksRows[i]);
				shelves=book.data('shelves');
				year=book.data('year');
//				dateRead=book.data('dateRead');
//				dateAdded=book.data('dateAdded');

				//APPLY FILTERS
				ok=!filters.years.length;
				//years filter
				for (var k=0;k<filters.years.length;k++){
					filterYear=$(filters.years[k]).data('year');	//ex: "2018"
					if (filterYear==year){
						ok=true;
						break;
					}
				}
				//shelves filter
				if (ok){
					for (var k=0;k<filters.shelves.length;k++){
						filterShelves=$(filters.shelves[k]).data('name');	//ex: "g_biograpy"
						if (shelves.indexOf(filterShelves)===-1){
							ok=false;
							break;
						}
					}
				}
				//show\hide book
				if (ok){
//					book.show('slow');
					book.show();
					okNumber++;
					//counters
					counters['years'][year]=(counters['years'][year] || 0)+1;
					for (var k=0;k<shelves.length;k++){
						counters['shelves'][shelves[k]]=(counters['shelves'][shelves[k]] || 0)+1;
					}
				}else{
//					book.hide('slow');
					book.hide();
				}
			}
			//display total number of books filtered
			_BSD.bookShowed.html(okNumber);

			//SHOW\HIDE SHELVES AND UPDATE COUNTERS
			for (var i=0;i<_BSD.shelvesA.length;i++){
				el=$(_BSD.shelvesA[i]);
				shelf=el.data('name');

				//update shelf counter
				foundNumber=counters['shelves'][shelf] || 0;
				el.find('span').html(foundNumber);
				//show\hide shelf
				if (foundNumber || el.hasClass('selected')){
					el.show();
				}else{
					el.hide();
				}
			}
			for (var i=0;i<_BSD.yearA.length;i++){
				el=$(_BSD.yearA[i]);
				year=el.data('year');
				okNumber=counters['years'][year] || 0;
				//update year counter
				el.find('span').html(okNumber);
				if (okNumber){
					el.css({'opacity':'1','font-weight':'bold'});
				}else{
					el.css({'opacity':'0.4','font-weight':'normal'});
				}
			}
		},

		//BOOKSHELVES VIEWER: return layout of books counter
		_bookshelvesViewer_layoutAddCounter=function(n){
			/*Input parameters:
				n	= number of books
			Return value:	shelf counter DOM
			*/
			return $('<span class="samoShelfCounter"/>').html(n);
		},

		//BOOKSHELVES VIEWER: click function on shelf\year filter
		_bookshelvesViewer_clickFilter=function(el){
			/*Input parameters:
				el	= filter clicked
			*/
			if (el.hasClass('selected')){
				el.removeClass('selected');
			}else{
				el.addClass('selected');
			}
			_bookshelvesViewer_filterBooks();
		},


		/**************************************************************************************************************
		******   LOG   ************************************************************************************************
		**************************************************************************************************************/
		//OUTPUT TO DOM (of all input parameters)
		_debugLog=function(){
			/*Input parameters:
				xxx	= any parameters would be putted on DOM new console (at the top)
			*/
			if (!_bDebug){return;}
			var container=$('<div/>',{'style':'border-bottom:3px solid #fff;font-size:10px'});
			//create console on DOM
			if (_bDebugConsole===null){
				_bDebugConsole=$('<div/>',{'style':'background:#a0e6a0;margin-top:100px'}).prependTo($('body')).append($('<div/>').html('CONSOLE LOG DEBUG'))
			}
			//output console
			for (var i=0;i<arguments.length;i++){
				container.append(
					$('<div/>')
					.append(arguments[i])
				);
			}
			_bDebugConsole.append(container);
		},


		/**************************************************************************************************************
		******   BUTTONS MENU   ***************************************************************************************
		**************************************************************************************************************/
		_menuOptionsButton=function(buttonType){
			/*Input parameters:
				buttonType	= type of button to create
			*/
			var left=$('<div/>',{'class':'gr-mediaBox__media u-marginRightMedium'}),
				right=$('<div/>',{'class':'gr-mediaBox__desc u-defaultType'}),
				results=$('<div/>',{
					'class':'results',
					'style':[
						,'display:none'
						,'background: white'
						,'text-align: center'
						,'padding: 10px'
						,'border-radius: 10px'
						,'margin-top: 20px'
					].join(';')
				}),
				btn=$('<button/>',{'style':[
												'border-radius: 5px'
												,'height: 40px'
												,'width: 40px'
											].join(';')
									});
			switch (buttonType){

			/*****   FIND EDITIONS IN LANGUAGE OF CURRENT BOOK   ************************************************************/
			case 'bookEditionsLanguage':
				//filter format
				_bookEditionsLanguage_FormatSelect=$('<select/>',{'style':'background: #ececb6;float:right;display:none'})
				.change(function(){
					var books=results.find('>.elementList'),
					_bookEditionsLanguage_FormatFilter=$(this).val();	//ex: "Paperback"
					//show only book with this format
					if (_bookEditionsLanguage_FormatFilter){
						books.each(function(index,book){
							book=$(book);
							if (book.data('format')===_bookEditionsLanguage_FormatFilter){
								book.show('slow');
							}else{
								book.hide('slow');
							}
						});
					}else{
						books.show();
					}
				});
				left
				.append(
					btn.css({
						'background':'url(/assets/layout/header/icn_nav_search.svg) no-repeat'
						,'background-size':'27px'
						,'background-position':'center'
						,'background-color':'#F4F1EA'
					})
					.click(function(){
						var allEditions=$('.otherEditionsActions a').eq(0);
						//reset previously results
						_bookEditionLanguageFound=0;	//number of results found
						_headerButton_BookEditionsLang=results.empty().append(_imgLoading()).show('slow');
						//reset filter format
						_bookEditionsLanguage_Format=[];
						_bookEditionsLanguage_FormatFilter='';
						if (_bookEditionsLanguage_FormatSelect!==null){
							_bookEditionsLanguage_FormatSelect
							.empty()
							.hide()
							.append($('<option/>',{'value':''}).html('-- FILTER FORMAT --'));
						}
						//search specific language editions
						results.addClass('workEditions');
						_bookEditionsLanguage(allEditions.attr('href'),_languageDesc);
					})
				);
				right
				.append(
					$('<div/>',{'style':'font-weight:bold'})
					.html('Find '+_languageButtonSpan+' Editions (of current book)')
				)
				.append($('<small/>').html(_bookTitle.html()))
				.append(_bookEditionsLanguage_FormatSelect);
				break;

			/*****   REPLACE BOOK LIST IN LANGUAGE   *********************************************************************/
			case 'booksListLanguage':
				left
				.append(
					btn.css({
						'background':'url(/assets/layout//grid-2c030bffe1065f73ddca41540e8a267d.png) no-repeat'
						,'background-size':'27px'
						,'background-position':'center'
						,'background-color':'#F4F1EA'
					})
					.click(function(){
/*todo
verifica di richiamo una volta sola, a meno che non vada in errore (es: per connessione interrotta)
*/
						_headerReplaceBook_Counters=results.empty().append(_imgLoading()).show('slow');
						_booksListLanguage(_languageDesc);
					})
				);

				right
				.append(
					$('<div/>',{'style':'font-weight:bold'})
					.html('Replace books with '+_languageButtonSpan+' edition')
				)
				.append(
					$('<small/>')
					.append(
						$('<input/>',{'type':'checkbox','id':'samoBookReplace_visibility'})
						.change(function(){
							_BLL_visibility($(this).prop('checked'));
						})
					)
					.append($('<label/>',{'for':'samoBookReplace_visibility'}).html('Hide books not found'))
				);
				break;

			/*****   BOOKSHELVES VIEWER   ************************************************************/
			case 'bookshelvesViewer':
				_BSD_shelfAnalyze=$('<select/>',{'style':'background: #ececb6;float:right;'});
				for (var i=0;i<_BSD.shelvesAnalyze.length;i++){
					_BSD_shelfAnalyze.append(
/*TODO
valore di default 
	da samoGoodreadsUtility
*/
						$('<option/>',{'value':_BSD.shelvesAnalyze[i].name,'data-index':i})
						.html(_BSD.shelvesAnalyze[i].name)
					);
				}
				left
				.append(
					btn.css({
						'background':'url(https://s.gr-assets.com/assets/layout/list-fe412c89a6a612c841b5b58681660b82.png) no-repeat'
						,'background-size':'27px'
						,'background-position':'center'
						,'background-color':'#F4F1EA'
					})
					.click(function(){
						//search bookshelves data
						results.addClass('bookshelvesViewer');
						_headerBookshelves_Counters=results.empty().append(_imgLoading()).show('slow');
						return _bookshelvesViewer(_BSD_shelfAnalyze.find('option:selected').data('index'));
					})
				);
				right
				.append(
					$('<div/>',{'style':'font-weight:bold'})
					.html('Bookshelves viewer')
				)
				.append($('<small/>').html('&nbsp;'))
				.append(_BSD_shelfAnalyze);
				break;
			}
			return $('<div/>',{
						'class':'samoOption gr-mediaBox',
						'style':'border-bottom: 1px solid #D8D8D8;list-style-type: none;padding: 8px 15px;'
					})
					.append(left)
					.append(right)
					.append(results);
		};

		/**************************************************************************************************************
		******   INITIALIZE   *****************************************************************************************
		**************************************************************************************************************/
		$(document).ready(function(){
			var language=$('<select/>',{'id':'samoLang','style':'background: #ececb6;'}),
				menu,
				MENU_CLASS_OPENED='dropdown__menu--show',
				citazione,
				version,
				options=$('<div/>',{'class':'samoOptions gr-notifications gr-box gr-box gr-box--forceScrollBar'}).css('max-height','600px'),
				body=$('body');

			//check for debug on browser: add on url ?samodebug=true
			if (window.location.search.indexOf('samodebug=true')>-1){_bDebug=true;}

			$('#samoMenu').remove();	//remove previously menù added (facility when develops)
			_headerButtons=$('ul.personalNav').eq(0);
			_bookTitle=$('#bookTitle');


			//PAGE "BOOK"; ex: https://www.goodreads.com/book/show/31678975-nemici
			if (_bookTitle.length){
				_pageType=_PAGE_TYPE_BOOK;

				//replace book
				options.append(_menuOptionsButton('booksListLanguage'));
				//search books editions in language
				options.append(_menuOptionsButton('bookEditionsLanguage'));

			//PAGE "Goodreads Choice Awards"; ex: https://www.goodreads.com/choiceawards/best-books-2018
			}else if (body.prop('id')==='gcaLanding'){
				_pageType=_PAGE_TYPE_GOODREADS_CHOICE_AWARDS;

				//replace book
				options.append(_menuOptionsButton('booksListLanguage'));

			//PAGE "Goodreads Choice Awards Category": ex: https://www.goodreads.com/choiceawards/best-nonfiction-books-2018
			}else if (body.prop('id').startsWith('gca')){	//ex: "gca2018"
				_pageType=_PAGE_TYPE_GOODREADS_CHOICE_AWARDS_CATEGORY;

				//replace book
				options.append(_menuOptionsButton('booksListLanguage'));

			//PAGE "Author"; ex: https://www.goodreads.com/author/show/14444.Isaac_Bashevis_Singer
			}else if ($('#authorFollowWidget').length){
				_pageType=_PAGE_TYPE_AUTHOR;

				//replace book
				options.append(_menuOptionsButton('booksListLanguage'));

			//PAGE "Author books"; ex: https://www.goodreads.com/author/list/14444.Isaac_Bashevis_Singer
			}else if (document.title.startsWith('Books by ')){	//ex: "Books by Luciano Canfora (Author of The Vanished Library) | Goodreads"
				_pageType=_PAGE_TYPE_AUTHOR_BOOKS;

				//replace book
				options.append(_menuOptionsButton('booksListLanguage'));

			//PAGES "Listopia"
			}else if ($('.listHeaderLinks').length){

				//replace book
				options.append(_menuOptionsButton('booksListLanguage'));

				//PAGES "Listopia"; ex: https://www.goodreads.com/list/show/1058.Microhistory_Social_Histories_of_Just_One_Thing
				if ($('#all_votes table.tableList').length){
					_pageType=_PAGE_TYPE_LIST;

				//PAGE "Listopia votes of ..."; ex: https://www.goodreads.com/list/user_vote/6403371
				}else if ($('.leftContainer table.tableList').length){
					_pageType=_PAGE_TYPE_LIST_USERVOTES;

				//PAGE "Listopia" other; ex: https://www.goodreads.com/list
				}else{
//					_pageType=;
				}
			
			//PAGE "Recommendations"; ex: https://www.goodreads.com/recommendations
			//PAGE "Recommendations by shelf"; ex: https://www.goodreads.com/recommendations/shelf/my_favorites
			//PAGE "Recommendations by genre"; ex: https://www.goodreads.com/recommendations/genre/art
			}else if ($('div.recsListing').length){
				_pageType=_PAGE_TYPE_RECOMMENDATIONS;

				//replace book
				options.append(_menuOptionsButton('booksListLanguage'));

			//PAGE "My Books"
			}else if ($('#columnContainer').hasClass('myBooksPage')){
				_pageType=_PAGE_TYPE_MYBOOKS;

				//bookshelves viewer
				options.append(_menuOptionsButton('bookshelvesViewer'));

			//PAGE "Favorites Genres"; ex: https://www.goodreads.com/genres
			}else if ($('.mainContent h1').html()==='Genres'){
				_pageType=_PAGE_TYPE_FAVORITES_GENRES;

				//replace book
				options.append(_menuOptionsButton('booksListLanguage'));

			//PAGE "Favorites Genres\specific genre"; ex: https://www.goodreads.com/genres/art
			}else if ($('.mainContent .leftContainer .breadcrumbs a').eq(0).html()==='Genres'
 					&& $('.mainContent .leftContainer .genreHeader').length){
				_pageType=_PAGE_TYPE_FAVORITES_GENRES_SPECIFIC;

				//replace book
				options.append(_menuOptionsButton('booksListLanguage'));

			//OTHER PAGES
			}else{
				
/*TODO
HOMEPAGE
	BODY.gr-homePageBody
				_pageType='xxx';
*/
			}
			console.log(_logPrefix+'Page identified as '+_pageType);

			//CITAZIONE
			citazione=$('<div/>',{
				'class':'citazione',
				'style':'font-style: italic;'
			})
			.append($('<div/>',{'class':'frase'}))
			.append($('<div/>',{'class':'autore','style':'text-align:right;color: red;'}));

			//LANGUAGE
			for (var i=0;i<_languages.length;i++){
				language.append($('<option/>',{'value':_languages[i][0]}).html(_languages[i][1]));
			}
			language
			.change(function(){
				var el=$(this);
				//set language variables
				_languageCod=el.val();	//ex: "ita"
				_languageDesc=el.find('option:selected').text();	//ex: "Italian"
				console.log(_logPrefix+'Language '+_languageCod+'='+_languageDesc);
				//change language description on menu options
				$('#samoMenu').find('.samoOption .LANGUAGE_DESCRIPTION').each(function(){
					$(this).html(_languageDesc);
				});
			});

			//VERSION
			version=$('<a/>',{
				'href':		'https://github.com/asamorini/goodreads.utility/',
				'target':	'_blank',
				'style':'margin-left:5px;border-radius: 5px;padding: 2px 4px;color:#525050;font-weight: normal;'
			})
			.html(_VERSION)
			.css({
				'-moz-transition':		'all 1s ease-in',
				'-webkit-transition':	'all 1s ease-in',
				'-o-transition':		'all 1s ease-in',
				'transition':			'all 1s ease-in'
			});

			//MENU
			menu=$('<div/>',{
				'class':'dropdown__menu dropdown__menu--notifications gr-box gr-box--withShadowLarge'
				,'style':'background: #e0e0c5;width:400px;'
			})
			.append(
				$('<section/>',{'class':'dropdown__container'})

				//menu header
				.append(
					$('<div/>',{
						'class':'siteHeader__dropdownHeading'
						,'style':'border-bottom: 1px solid #afa5a2'
					})
					.append(
						$('<h3/>',{'class':'siteHeader__heading siteHeader__dropdownHeader'})
						.html('"SAMO" Goodreads Utility')
						.append(version)
					)
					.append(language)
					.append(citazione)
				)

				//menu options
				.append(options)
			);

			//HEADER BUTTON MENU
			_menuSamoButton=$('<a/>',{
				'class':	'dropdown__trigger dropdown__trigger--profileMenu dropdown__trigger--personalNav',
				'style':	'background-image: linear-gradient(#292625, #e0e0c5);'
			})
			.append(
				$('<span/>',{'class':'headerPersonalNav__icon'})
				.append(
					$('<img/>',{
						'class':	'circularIcon circularIcon--border',
						'src':		'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/users/1480287508i/35318441._UX60_CR0,0,60,60_.jpg',
						'title':	'Goodreads utility'
					})
				)
			).click(function(){
				var citazioneRandom;

				//chiusura menù
				if (menu.hasClass(MENU_CLASS_OPENED)){
					menu.slideUp('slow',function(){
						menu.removeClass(MENU_CLASS_OPENED);
					});

				//apertura menù
				}else{
					//citazione random
					citazioneRandom=_CITAZIONI[Math.floor(Math.random()*_CITAZIONI.length)];
					citazione.find('.frase').html(citazioneRandom[0]);
					citazione.find('.autore').html(citazioneRandom[1]);
					menu.slideDown('slow',function(){
						menu.addClass(MENU_CLASS_OPENED);
					});
				}
			});

			//add button to menù
			_headerButtons.prepend(
				$('<li/>',{
					'id':	'samoMenu',
					'class':'personalNav__listItem'
				}).append(
					$('<div/>',{'style':'position:relative'})
					.append(_menuSamoButton)
					.append(menu)
				)
			);
			language.val(samoGoodreadsUtility.lang).change();	//set default language
			_menuSamoButton.click();	//automatically open menu


			//"version" highlight effect: START
			setTimeout(function(){
				version.css({'color':'red','font-weight':'bold','background':'#9cce88'});
				//"version" highlight effect: END
				setTimeout(function(){
					version.css({'color':'#525050','font-weight':'normal','background':'inherit'});
				},1500);
			},1000);
		});
	
	//-----------------   public methods   -----------------
	return{

		//errors
/*TODO
		ERR_PARTNUMBER_NOT_FOUND:			'PARTNUMBER_NOT_FOUND',
*/

		/***************************************************************************
		****   XXX   ****************************************
		***************************************************************************/
/*TODO
		XXX:function(lang){

		}
*/
		
	};
})(jQuery);
