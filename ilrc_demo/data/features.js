/**
 * Created by michaeldowd on 4/10/17.
 */
var features = ["Spanish" , "English" , "Chinese" , "Hindi" , "French" , "Filipino" , "Dravidian" , "Korean" , "Arabic" , "other_lang" ,
    "native_eng" , "good_engli" , "little_eng" , "no_english" ,
    "ba_college" , "some_colle" , "high_schoo" , "no_high_sc" ,
    "under_18" , "18 to 24 y" , "25 to 34 y" , "35 to 44 y" , "45 to 64 y" , "65 and old" ,
    "Female" , "Male" ,
    "entry_2010" , "2005 to 20" , "2000 to 20" , "1995 to 19" , "1990 to 19" , "Before 199" ,
    "Married" , "Not marrie" ,
    "computer_a" , "internet_a" , "computer_1" ,
    "at_or_abov" , "below_pove" ,
    "health_ins" , "no_health_"  ];

var feature_groups = {
    'Language spoken at home': ['Spanish', 'English', 'Chinese', 'Hindi', 'French', 'Filipino', 'Dravidian', 'Korean', 'Arabic', 'Other'],
    'Ability to speak English':["native_eng" , "good_engli" , "little_eng" , "no_english"],
    'Educational Attainment': ["ba_college" , "some_colle" , "high_schoo" , "no_high_sc" ],
    'Age': ["under_18" , "18 to 24 y" , "25 to 34 y" , "35 to 44 y" , "45 to 64 y" , "65 and old"],
    'Sex': ['Female','Male'],
    'Period of Entry': ["entry_2010" , "2005 to 20" , "2000 to 20" , "1995 to 19" , "1990 to 19" , "Before 199"],
    'Marital Status': ["Married" , "Not marrie"],
    'Access to Computer / Internet': ["computer_a" , "internet_a" , "computer_1"],
    'Poverty Status': ["at_or_abov" , "below_pove"],
    'Health Insurance Coverage':["health_ins" , "no_health_"  ]
};

var feature_groups_lookup = {
    "Spanish" :'Language spoken at home',
    "English" : 'Language spoken at home' ,
    "Chinese" : 'Language spoken at home' ,
    "Hindi" : 'Language spoken at home' ,
    "French" : 'Language spoken at home',
    "Filipino" :'Language spoken at home',
    "Dravidian": 'Language spoken at home',
    "Korean" : 'Language spoken at home',
    "Arabic" : 'Language spoken at home',
    "other_lang" : 'Language spoken at home',
    "native_eng" :'Ability to speak English',
    "good_engli":'Ability to speak English' ,
    "little_eng": 'Ability to speak English' ,
    "no_english" : 'Ability to speak English',
    "ba_college" : 'Educational Attainment',
    "some_colle" : 'Educational Attainment',
    "high_schoo" :'Educational Attainment',
    "no_high_sc": 'Educational Attainment' ,
    "under_18" :"Age",
    "18 to 24 y" : "Age",
    "25 to 34 y" : "Age" ,
    "35 to 44 y" : "Age",
    "45 to 64 y" : "Age",
    "65 and old" : "Age",
    "Female" :"Sex",
    "Male" : "Sex",
    "entry_2010": 'Period of Entry' ,
    "2005 to 20" : 'Period of Entry' ,
    "2000 to 20" : 'Period of Entry',
    "1995 to 19" : 'Period of Entry',
    "1990 to 19" : 'Period of Entry',
    "Before 199" : 'Period of Entry',
    "Married":'Marital Status' ,
    "Not marrie" : 'Marital Status',
    "computer_a": 'Access to Computer / Internet' ,
    "internet_a": 'Access to Computer / Internet' ,
    "computer_1" : 'Access to Computer / Internet',
    "at_or_abov" : 'Poverty Status' ,
    "below_pove" : 'Poverty Status' ,
    "health_ins" : 'Health Insurance Coverage' ,
    "no_health_": 'Health Insurance Coverage'
};

var feature_groups_back_lookup = {
    "Spanish" :'Spanish',
    "English" : 'English' ,
    "Chinese" : 'Chinese' ,
    "Hindi" : 'Hindi' ,
    "French" : 'French',
    "Filipino" :'Filipino',
    "Dravidian": 'Dravidian',
    "Korean" : 'Korean',
    "Arabic" : 'Arabic',
    "other_lang" : 'Other Language',
    "native_eng" :'Native English',
    "good_engli":'Good English' ,
    "little_eng": 'Little English' ,
    "no_english" : 'No English',
    "ba_college" : 'Bachelors Degree',
    "some_colle" : 'Some College',
    "high_schoo" :'High School Degree',
    "no_high_sc": 'No High School Degree' ,
    "under_18" :"Under 18",
    "18 to 24 y" : "18 to 24",
    "25 to 34 y" : "25 to 34" ,
    "35 to 44 y" : "35 to 44",
    "45 to 64 y" : "45 to 64",
    "65 and old" : "65 and old",
    "Female" :"Female",
    "Male" : "Male",
    "entry_2010": 'After 2010' ,
    "2005 to 20" : '2005 to 2010' ,
    "2000 to 20" : '2000 to 2005',
    "1995 to 19" : '1995 to 2000',
    "1990 to 19" : '1990 to 1995',
    "Before 199" : 'Before 1990',
    "Married":'Married' ,
    "Not marrie" : 'Unmarried',
    "computer_a": 'Computer Access' ,
    "internet_a": 'Internet Access' ,
    "computer_1" : 'Computer 1',
    "at_or_abov" : 'At or Above' ,
    "below_pove" : 'Below' ,
    "health_ins" : 'Has Coverage' ,
    "no_health_": 'No Coverage'
};