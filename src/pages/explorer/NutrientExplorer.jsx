import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// ─── NUTRIENTS DATA (32 nutrients: Vitamins, Minerals, Macronutrients, Phytonutrients) ───
const nutrients=[
  {id:1,cat:"Vitamin",name:"Vitamin A",aka:"Retinol, Beta-carotene",func:"Supports vision (especially night vision), immune function, skin health, and cell growth.",benefits:"Reduces risk of age-related macular degeneration; supports skin integrity; critical for immune defense.",foods:[{n:"Liver",t:"Meat",s:"3 oz",v:"6,582 mcg RAE"},{n:"Sweet potato",t:"Vegetables",s:"1 medium",v:"1,096 mcg RAE",note:"Top plant source."},{n:"Carrots",t:"Vegetables",s:"half cup",v:"459 mcg RAE"},{n:"Spinach",t:"Vegetables",s:"half cup cooked",v:"472 mcg RAE"},{n:"Mango",t:"Fruits",s:"1 cup",v:"89 mcg RAE"},{n:"Milk",t:"Dairy",s:"1 cup",v:"149 mcg RAE"}],rda:{female:{"50-60":"700 mcg RAE/day","61-70":"700 mcg RAE/day","71+":"700 mcg RAE/day"},male:{"50-60":"900 mcg RAE/day","61-70":"900 mcg RAE/day","71+":"900 mcg RAE/day"}},deficiency:["Night blindness","Dry skin and eyes","Increased infection risk"],enhances:["Zinc (needed for transport)","Fat (fat-soluble absorption)"],inhibits:["Excessive alcohol (depletes stores)"]},
  {id:2,cat:"Vitamin",name:"Vitamin B1",aka:"Thiamine",func:"Converts carbohydrates into energy; essential for nerve and muscle function, especially heart muscle.",benefits:"Supports cognitive function; may reduce diabetes complications; critical for metabolic health.",foods:[{n:"Pork",t:"Meat",s:"3 oz",v:"0.81 mg"},{n:"Sunflower seeds",t:"Grains",s:"1 oz",v:"0.58 mg",note:"Best plant source."},{n:"Black beans",t:"Legumes",s:"half cup",v:"0.21 mg"},{n:"Trout",t:"Seafood",s:"3 oz",v:"0.35 mg"},{n:"Brown rice",t:"Grains",s:"half cup",v:"0.18 mg"}],rda:{female:{"50-60":"1.1 mg/day","61-70":"1.1 mg/day","71+":"1.1 mg/day"},male:{"50-60":"1.2 mg/day","61-70":"1.2 mg/day","71+":"1.2 mg/day"}},deficiency:["Beriberi (nerve damage)","Wernicke-Korsakoff syndrome","Fatigue and weakness"],enhances:["Magnesium (cofactor)"],inhibits:["Raw fish (thiaminase)","Alcohol (major depletor)"]},
  {id:3,cat:"Vitamin",name:"Vitamin B2",aka:"Riboflavin",func:"Key role in energy metabolism; antioxidant function; supports growth and red blood cell production.",benefits:"Migraine prevention; supports healthy skin and eyes; involved in iron metabolism.",foods:[{n:"Beef liver",t:"Meat",s:"3 oz",v:"2.9 mg"},{n:"Milk",t:"Dairy",s:"1 cup",v:"0.45 mg"},{n:"Almonds",t:"Nuts",s:"1 oz",v:"0.32 mg"},{n:"Eggs",t:"Eggs",s:"1 large",v:"0.23 mg"},{n:"Mushrooms",t:"Vegetables",s:"half cup",v:"0.23 mg"}],rda:{female:{"50-60":"1.1 mg/day","61-70":"1.1 mg/day","71+":"1.1 mg/day"},male:{"50-60":"1.3 mg/day","61-70":"1.3 mg/day","71+":"1.3 mg/day"}},deficiency:["Cracked lips","Sore throat","Skin inflammation","Anemia"],enhances:["Iron absorption","Vitamin B6 activation"],inhibits:["Light (destroys riboflavin)"]},
  {id:4,cat:"Vitamin",name:"Vitamin B3",aka:"Niacin",func:"Supports energy metabolism (NAD/NADP coenzymes), DNA repair, cell signaling, and fatty acid synthesis.",benefits:"Raises HDL cholesterol; may reduce cardiovascular risk; supports skin health.",foods:[{n:"Chicken breast",t:"Meat",s:"3 oz",v:"11.4 mg"},{n:"Tuna",t:"Seafood",s:"3 oz",v:"8.6 mg"},{n:"Turkey",t:"Meat",s:"3 oz",v:"10 mg"},{n:"Peanuts",t:"Nuts",s:"1 oz",v:"4.4 mg"},{n:"Brown rice",t:"Grains",s:"half cup",v:"2.6 mg"}],rda:{female:{"50-60":"14 mg NE/day","61-70":"14 mg NE/day","71+":"14 mg NE/day"},male:{"50-60":"16 mg NE/day","61-70":"16 mg NE/day","71+":"16 mg NE/day"}},deficiency:["Pellagra","Fatigue","Depression"],enhances:["Tryptophan (converted to niacin)"],inhibits:["High-dose supplements cause flushing"]},
  {id:5,cat:"Vitamin",name:"Vitamin B6",aka:"Pyridoxine",func:"Involved in 100+ enzyme reactions; critical for amino acid metabolism, neurotransmitter synthesis, and hemoglobin.",benefits:"Supports brain health; may reduce PMS symptoms; homocysteine regulation for heart health.",foods:[{n:"Chickpeas",t:"Legumes",s:"half cup",v:"0.57 mg",note:"Best plant source."},{n:"Salmon",t:"Seafood",s:"3 oz",v:"0.56 mg"},{n:"Chicken",t:"Meat",s:"3 oz",v:"0.51 mg"},{n:"Bananas",t:"Fruits",s:"1 medium",v:"0.43 mg"},{n:"Potatoes",t:"Vegetables",s:"1 medium",v:"0.41 mg"}],rda:{female:{"50-60":"1.3 mg/day","61-70":"1.5 mg/day","71+":"1.5 mg/day"},male:{"50-60":"1.3 mg/day","61-70":"1.7 mg/day","71+":"1.7 mg/day"}},deficiency:["Anemia","Peripheral neuropathy","Weakened immunity","Depression"],enhances:["Magnesium","Zinc","Riboflavin (B2)"],inhibits:["Alcohol","Some medications (isoniazid)"]},
  {id:6,cat:"Vitamin",name:"Vitamin B9",aka:"Folate",func:"DNA synthesis and repair, cell division, amino acid metabolism. Critical during pregnancy.",benefits:"Prevents neural tube defects; reduces stroke risk; supports mood regulation; lowers homocysteine.",foods:[{n:"Spinach",t:"Vegetables",s:"half cup cooked",v:"131 mcg DFE"},{n:"Black-eyed peas",t:"Legumes",s:"half cup",v:"105 mcg DFE"},{n:"Asparagus",t:"Vegetables",s:"4 spears",v:"89 mcg DFE"},{n:"Beef liver",t:"Meat",s:"3 oz",v:"215 mcg DFE"},{n:"Avocado",t:"Fruits",s:"half medium",v:"59 mcg DFE"}],rda:{female:{"50-60":"400 mcg DFE/day","61-70":"400 mcg DFE/day","71+":"400 mcg DFE/day"},male:{"50-60":"400 mcg DFE/day","61-70":"400 mcg DFE/day","71+":"400 mcg DFE/day"}},deficiency:["Megaloblastic anemia","Fatigue","Mouth sores"],enhances:["Vitamin B12 (synergy)","Vitamin C"],inhibits:["Alcohol","Methotrexate","Heat (cooking)"]},
  {id:7,cat:"Vitamin",name:"Vitamin B12",aka:"Cobalamin",func:"DNA synthesis, red blood cell formation, neurological function, and fatty acid metabolism.",benefits:"Prevents megaloblastic anemia; supports cognitive health and nerve function; reduces homocysteine.",foods:[{n:"Clams",t:"Seafood",s:"3 oz",v:"84.1 mcg",note:"Exceptional source."},{n:"Beef liver",t:"Meat",s:"3 oz",v:"70.7 mcg"},{n:"Salmon",t:"Seafood",s:"3 oz",v:"4.9 mcg"},{n:"Milk",t:"Dairy",s:"1 cup",v:"1.2 mcg"},{n:"Eggs",t:"Eggs",s:"2 large",v:"1.0 mcg"}],rda:{female:{"50-60":"2.4 mcg/day","61-70":"2.4 mcg/day","71+":"2.4 mcg/day"},male:{"50-60":"2.4 mcg/day","61-70":"2.4 mcg/day","71+":"2.4 mcg/day"}},deficiency:["Megaloblastic anemia","Neurological damage","Memory loss","Fatigue"],enhances:["Folate (B9)","Intrinsic factor","Calcium"],inhibits:["Metformin","PPIs","Vegan diet"]},
  {id:8,cat:"Vitamin",name:"Vitamin C",aka:"Ascorbic Acid",func:"Powerful antioxidant; collagen synthesis; immune function; neurotransmitter synthesis; enhances iron absorption.",benefits:"Reduces cold duration; supports wound healing; protects against oxidative damage.",foods:[{n:"Red bell peppers",t:"Vegetables",s:"half cup",v:"95 mg",note:"Exceeds daily target."},{n:"Kiwi",t:"Fruits",s:"1 medium",v:"71 mg"},{n:"Broccoli",t:"Vegetables",s:"half cup",v:"51 mg"},{n:"Strawberries",t:"Fruits",s:"1 cup",v:"85 mg"},{n:"Oranges",t:"Fruits",s:"1 medium",v:"70 mg"}],rda:{female:{"50-60":"75 mg/day","61-70":"75 mg/day","71+":"75 mg/day"},male:{"50-60":"90 mg/day","61-70":"90 mg/day","71+":"90 mg/day"}},deficiency:["Scurvy","Poor wound healing","Fatigue","Weakened immunity"],enhances:["Iron (non-heme) absorption","Regenerates vitamin E"],inhibits:["High heat and cooking"]},
  {id:9,cat:"Vitamin",name:"Vitamin D",aka:"Calciferol",func:"Regulates calcium/phosphorus absorption; critical for bone health, immune function, and neuromuscular function.",benefits:"Reduces fracture risk; supports immune defense; may reduce depression and autoimmune risk.",foods:[{n:"Trout",t:"Seafood",s:"3 oz",v:"645 IU",note:"Meets daily target."},{n:"Salmon",t:"Seafood",s:"3 oz",v:"570 IU"},{n:"Mushrooms (UV)",t:"Vegetables",s:"half cup",v:"366 IU"},{n:"Milk (fortified)",t:"Dairy",s:"1 cup",v:"120 IU"},{n:"Eggs",t:"Eggs",s:"1 large",v:"44 IU"}],rda:{female:{"50-60":"600 IU/day","61-70":"600 IU/day","71+":"800 IU/day"},male:{"50-60":"600 IU/day","61-70":"600 IU/day","71+":"800 IU/day"}},deficiency:["Osteomalacia / osteoporosis","Weakened immunity","Muscle weakness","Depression"],enhances:["Calcium (absorption)","Magnesium (activates D)","Vitamin K2"],inhibits:["Obesity (sequesters D)","Limited sun","Dark skin pigmentation"]},
  {id:10,cat:"Vitamin",name:"Vitamin E",aka:"Tocopherol",func:"Fat-soluble antioxidant protecting cell membranes; immune function; skin health; anti-inflammatory.",benefits:"Reduces oxidative stress; supports skin integrity; anti-inflammatory properties.",foods:[{n:"Wheat germ oil",t:"Oils",s:"1 tbsp",v:"20 mg",note:"Richest known source."},{n:"Sunflower seeds",t:"Grains",s:"1 oz",v:"7.4 mg"},{n:"Almonds",t:"Nuts",s:"1 oz",v:"7.3 mg"},{n:"Spinach",t:"Vegetables",s:"half cup",v:"1.9 mg"},{n:"Avocado",t:"Fruits",s:"half medium",v:"2.1 mg"}],rda:{female:{"50-60":"15 mg/day","61-70":"15 mg/day","71+":"15 mg/day"},male:{"50-60":"15 mg/day","61-70":"15 mg/day","71+":"15 mg/day"}},deficiency:["Peripheral neuropathy","Muscle weakness","Vision problems","Weakened immunity"],enhances:["Vitamin C (regenerates E)","Selenium (synergistic)"],inhibits:["High-dose supplements vs vitamin K","Fat malabsorption"]},
  {id:11,cat:"Vitamin",name:"Vitamin K",aka:"K1 / K2",func:"Essential for blood clotting and bone metabolism; activates proteins that regulate calcium distribution.",benefits:"Prevents excessive bleeding; supports bone density; may reduce arterial calcification (K2).",foods:[{n:"Kale",t:"Vegetables",s:"half cup cooked",v:"531 mcg",note:"Most K1-dense food."},{n:"Spinach",t:"Vegetables",s:"half cup cooked",v:"444 mcg"},{n:"Broccoli",t:"Vegetables",s:"half cup",v:"110 mcg"},{n:"Natto",t:"Legumes",s:"3 oz",v:"850 mcg MK-7",note:"Richest K2 source."},{n:"Cheese",t:"Dairy",s:"1 oz",v:"~10 mcg"}],rda:{female:{"50-60":"90 mcg/day","61-70":"90 mcg/day","71+":"90 mcg/day"},male:{"50-60":"120 mcg/day","61-70":"120 mcg/day","71+":"120 mcg/day"}},deficiency:["Excessive bleeding","Easy bruising","Weakened bones"],enhances:["Vitamin D (bone synergy)","Fat (fat-soluble)"],inhibits:["Warfarin","Antibiotics (reduce K2 bacteria)"]},
  {id:12,cat:"Mineral",name:"Calcium",aka:"",func:"Primary structural component of bones and teeth; muscle contraction, nerve transmission, blood clotting.",benefits:"Prevents osteoporosis; reduces blood pressure; supports muscle function.",foods:[{n:"Yogurt",t:"Dairy",s:"1 cup",v:"415 mg",note:">1/3 daily target."},{n:"Sardines+bones",t:"Seafood",s:"3 oz",v:"325 mg"},{n:"Milk",t:"Dairy",s:"1 cup",v:"300 mg"},{n:"Tofu (calcium-set)",t:"Legumes",s:"half cup",v:"200 mg"},{n:"Kale, cooked",t:"Vegetables",s:"1 cup",v:"180 mg"}],rda:{female:{"50-60":"1,200 mg/day","61-70":"1,200 mg/day","71+":"1,200 mg/day"},male:{"50-60":"1,000 mg/day","61-70":"1,000 mg/day","71+":"1,200 mg/day"}},deficiency:["Osteoporosis","Muscle cramps","Numbness","Arrhythmia"],enhances:["Vitamin D (absorption)","Vitamin K2 (directs to bones)","Lactose"],inhibits:["Phytates and oxalates","High sodium","Excess zinc or iron"]},
  {id:13,cat:"Mineral",name:"Iron",aka:"",func:"Core component of hemoglobin and myoglobin; energy metabolism and DNA synthesis.",benefits:"Prevents iron-deficiency anemia; supports cognitive function and immune defense.",foods:[{n:"Oysters",t:"Seafood",s:"3 oz",v:"7.8 mg",note:"Highest heme iron."},{n:"Beef liver",t:"Meat",s:"3 oz",v:"5.2 mg"},{n:"Lentils",t:"Legumes",s:"half cup",v:"3.3 mg"},{n:"Spinach",t:"Vegetables",s:"half cup",v:"3.2 mg"},{n:"Pumpkin seeds",t:"Grains",s:"1 oz",v:"2.5 mg"}],rda:{female:{"50-60":"8 mg/day","61-70":"8 mg/day","71+":"8 mg/day"},male:{"50-60":"8 mg/day","61-70":"8 mg/day","71+":"8 mg/day"}},deficiency:["Iron-deficiency anemia","Fatigue","Pale skin","Cold extremities"],enhances:["Vitamin C (non-heme absorption)","Cast iron cooking"],inhibits:["Calcium","Phytates","Tannins in tea/coffee"]},
  {id:14,cat:"Mineral",name:"Magnesium",aka:"",func:"Cofactor in 300+ reactions; muscle/nerve function, blood glucose control, blood pressure regulation.",benefits:"Reduces migraines; improves insulin sensitivity; supports bone density; may improve sleep and mood.",foods:[{n:"Pumpkin seeds",t:"Grains",s:"1 oz",v:"150 mg",note:"Most magnesium-dense."},{n:"Spinach",t:"Vegetables",s:"half cup",v:"78 mg"},{n:"Black beans",t:"Legumes",s:"half cup",v:"60 mg"},{n:"Almonds",t:"Nuts",s:"1 oz",v:"80 mg"},{n:"Avocado",t:"Fruits",s:"half medium",v:"29 mg"}],rda:{female:{"50-60":"320 mg/day","61-70":"320 mg/day","71+":"320 mg/day"},male:{"50-60":"420 mg/day","61-70":"420 mg/day","71+":"420 mg/day"}},deficiency:["Muscle cramps","Hypertension","Arrhythmia","Insomnia","Anxiety"],enhances:["Vitamin D (activates)","Calcium (balance)","B vitamins"],inhibits:["Alcohol","High sugar","Diuretics"]},
  {id:15,cat:"Mineral",name:"Zinc",aka:"",func:"Structural component of 300+ enzymes; immune function, wound healing, DNA synthesis, taste and smell.",benefits:"Shortens colds; supports wound healing; anti-inflammatory and antioxidant.",foods:[{n:"Oysters",t:"Seafood",s:"3 oz",v:"74 mg",note:"Exceeds weekly need."},{n:"Beef",t:"Meat",s:"3 oz",v:"7 mg"},{n:"Pumpkin seeds",t:"Grains",s:"1 oz",v:"2.2 mg"},{n:"Chickpeas",t:"Legumes",s:"half cup",v:"1.3 mg"},{n:"Cashews",t:"Nuts",s:"1 oz",v:"1.6 mg"}],rda:{female:{"50-60":"8 mg/day","61-70":"8 mg/day","71+":"8 mg/day"},male:{"50-60":"11 mg/day","61-70":"11 mg/day","71+":"11 mg/day"}},deficiency:["Impaired immunity","Hair loss","Poor wound healing","Loss of taste/smell"],enhances:["Vitamin A (transport)","Protein-rich foods"],inhibits:["Phytates","High calcium","Excessive copper"]},
  {id:16,cat:"Mineral",name:"Potassium",aka:"",func:"Maintains fluid balance, nerve signals, and muscle contractions. Counteracts sodium on blood pressure.",benefits:"Reduces hypertension; lowers stroke risk; protects against kidney stones.",foods:[{n:"Spinach, cooked",t:"Vegetables",s:"1 cup",v:"840 mg",note:"Richest source."},{n:"Sweet potato",t:"Vegetables",s:"1 medium",v:"540 mg"},{n:"White beans",t:"Legumes",s:"half cup",v:"500 mg"},{n:"Banana",t:"Fruits",s:"1 medium",v:"420 mg"},{n:"Avocado",t:"Fruits",s:"half medium",v:"350 mg"}],rda:{female:{"50-60":"2,600 mg/day","61-70":"2,600 mg/day","71+":"2,600 mg/day"},male:{"50-60":"3,400 mg/day","61-70":"3,400 mg/day","71+":"3,400 mg/day"}},deficiency:["Hypokalemia","Hypertension","Irregular heartbeat","Fatigue"],enhances:["Magnesium (heart synergy)"],inhibits:["High sodium","Diuretics","Alcohol"]},
  {id:17,cat:"Mineral",name:"Sodium",aka:"",func:"Regulates fluid balance and blood pressure; nerve impulse transmission and muscle contraction.",benefits:"Prevents hyponatremia; supports exercise hydration; essential at appropriate levels.",foods:[{n:"Table salt",t:"Other",s:"1 tsp",v:"2,300 mg"},{n:"Canned soups",t:"Other",s:"1 cup",v:"~800 mg"},{n:"Processed meats",t:"Meat",s:"3 oz",v:"~600 mg"},{n:"Cheese",t:"Dairy",s:"1 oz",v:"~180 mg"},{n:"Bread",t:"Grains",s:"1 slice",v:"~150 mg"}],rda:{female:{"50-60":"<2,300 mg/day","61-70":"<2,300 mg/day","71+":"<1,500 mg/day (ideal)"},male:{"50-60":"<2,300 mg/day","61-70":"<2,300 mg/day","71+":"<1,500 mg/day (ideal)"}},deficiency:["Hyponatremia","Muscle cramps"],enhances:["Chloride (electrolyte pair)"],inhibits:["Excess depletes potassium","Raises blood pressure"]},
  {id:18,cat:"Mineral",name:"Phosphorus",aka:"",func:"Structural component of bones, teeth, DNA, RNA; energy transfer (ATP).",benefits:"Bone/teeth strength; energy metabolism; cell membrane integrity.",foods:[{n:"Salmon",t:"Seafood",s:"3 oz",v:"315 mg"},{n:"Chicken",t:"Meat",s:"3 oz",v:"195 mg"},{n:"Milk",t:"Dairy",s:"1 cup",v:"205 mg"},{n:"Lentils",t:"Legumes",s:"half cup",v:"180 mg"},{n:"Almonds",t:"Nuts",s:"1 oz",v:"136 mg"}],rda:{female:{"50-60":"700 mg/day","61-70":"700 mg/day","71+":"700 mg/day"},male:{"50-60":"700 mg/day","61-70":"700 mg/day","71+":"700 mg/day"}},deficiency:["Bone fragility","Muscle weakness","Fatigue"],enhances:["Calcium (ratio for bones)","Vitamin D"],inhibits:["Aluminum antacids","Excess calcium"]},
  {id:19,cat:"Mineral",name:"Iodine",aka:"",func:"Essential for thyroid hormones (T3, T4) regulating metabolism, growth, and development.",benefits:"Prevents goiter/hypothyroidism; supports metabolic rate and energy.",foods:[{n:"Seaweed",t:"Vegetables",s:"1 g",v:"16-2,984 mcg",note:"Highly variable."},{n:"Cod",t:"Seafood",s:"3 oz",v:"99 mcg"},{n:"Milk",t:"Dairy",s:"1 cup",v:"56 mcg"},{n:"Eggs",t:"Eggs",s:"1 large",v:"24 mcg"}],rda:{female:{"50-60":"150 mcg/day","61-70":"150 mcg/day","71+":"150 mcg/day"},male:{"50-60":"150 mcg/day","61-70":"150 mcg/day","71+":"150 mcg/day"}},deficiency:["Goiter","Hypothyroidism","Fatigue"],enhances:["Selenium (T4 to T3)"],inhibits:["Goitrogens (raw cruciferous excess)"]},
  {id:20,cat:"Mineral",name:"Selenium",aka:"",func:"Antioxidant cofactor; thyroid metabolism; DNA synthesis; immune function.",benefits:"Reduces oxidative damage; supports thyroid; may reduce cancer risk.",foods:[{n:"Brazil nuts",t:"Nuts",s:"1 nut",v:"68-91 mcg",note:"1 nut exceeds daily need."},{n:"Tuna",t:"Seafood",s:"3 oz",v:"92 mcg"},{n:"Halibut",t:"Seafood",s:"3 oz",v:"47 mcg"},{n:"Beef",t:"Meat",s:"3 oz",v:"33 mcg"},{n:"Eggs",t:"Eggs",s:"1 large",v:"15 mcg"}],rda:{female:{"50-60":"55 mcg/day","61-70":"55 mcg/day","71+":"55 mcg/day"},male:{"50-60":"55 mcg/day","61-70":"55 mcg/day","71+":"55 mcg/day"}},deficiency:["Keshan disease","Hypothyroidism","Weakened immunity"],enhances:["Iodine (thyroid)","Vitamin E (synergistic)"],inhibits:["High doses = selenosis"]},
  {id:21,cat:"Mineral",name:"Copper",aka:"",func:"Cofactor for iron metabolism, antioxidant defense, energy, collagen, and neurotransmitter production.",benefits:"Supports iron absorption; critical for connective tissue; protects against oxidative damage.",foods:[{n:"Beef liver",t:"Meat",s:"3 oz",v:"12,400 mcg"},{n:"Oysters",t:"Seafood",s:"3 oz",v:"4,850 mcg"},{n:"Cashews",t:"Nuts",s:"1 oz",v:"622 mcg"},{n:"Dark chocolate",t:"Other",s:"1 oz",v:"498 mcg"},{n:"Sunflower seeds",t:"Grains",s:"1 oz",v:"519 mcg"}],rda:{female:{"50-60":"900 mcg/day","61-70":"900 mcg/day","71+":"900 mcg/day"},male:{"50-60":"900 mcg/day","61-70":"900 mcg/day","71+":"900 mcg/day"}},deficiency:["Anemia","Bone fractures","Neurological problems"],enhances:["Iron metabolism","Vitamin C"],inhibits:["Excess zinc","High-dose vitamin C"]},
  {id:22,cat:"Macronutrient",name:"Protein",aka:"Amino acids",func:"Building blocks of tissues, enzymes, hormones, and antibodies. Essential for growth, repair, and immune function.",benefits:"Preserves muscle mass; enhances satiety; wound healing; immune defense.",foods:[{n:"Chicken breast",t:"Meat",s:"3 oz",v:"26 g"},{n:"Tuna",t:"Seafood",s:"3 oz",v:"22 g"},{n:"Eggs",t:"Eggs",s:"2 large",v:"12 g"},{n:"Greek yogurt",t:"Dairy",s:"1 cup",v:"17 g"},{n:"Lentils",t:"Legumes",s:"half cup",v:"9 g"}],rda:{female:{"50-60":"~46 g/day (0.8 g/kg)","61-70":"~50 g/day (1.0 g/kg)","71+":"~50 g/day (1.0-1.2 g/kg)"},male:{"50-60":"~56 g/day (0.8 g/kg)","61-70":"~60 g/day (1.0 g/kg)","71+":"~60 g/day (1.0-1.2 g/kg)"}},deficiency:["Sarcopenia","Edema","Impaired immunity","Hair loss"],enhances:["Vitamin B6","Zinc","Heme iron"],inhibits:["Excess may stress kidneys"]},
  {id:23,cat:"Macronutrient",name:"Omega-3 Fatty Acids",aka:"EPA, DHA, ALA",func:"Cell membrane components; anti-inflammatory signaling; cardiovascular protection.",benefits:"Reduces triglycerides and CV risk; supports cognition; anti-inflammatory; may reduce depression.",foods:[{n:"Salmon",t:"Seafood",s:"3 oz",v:"1.8 g EPA+DHA",note:"Meets target in one serving."},{n:"Mackerel",t:"Seafood",s:"3 oz",v:"1.0-1.5 g"},{n:"Sardines",t:"Seafood",s:"3 oz",v:"1.1 g"},{n:"Flaxseeds",t:"Grains",s:"1 tbsp",v:"1.6 g ALA",note:"ALA converts at 5-10%."},{n:"Walnuts",t:"Nuts",s:"1 oz",v:"2.5 g ALA"}],rda:{female:{"50-60":"1.1 g ALA/day","61-70":"1.1 g ALA/day","71+":"1.1 g ALA/day"},male:{"50-60":"1.6 g ALA/day","61-70":"1.6 g ALA/day","71+":"1.6 g ALA/day"}},deficiency:["Dry skin","Poor cognition","Increased inflammation"],enhances:["Vitamin E (prevents oxidation)"],inhibits:["High omega-6 (competes)","Heat/oxidation"]},
  {id:24,cat:"Macronutrient",name:"Dietary Fiber",aka:"Soluble and Insoluble",func:"Digestive health; feeds gut microbiome; slows glucose absorption; lowers LDL; promotes satiety.",benefits:"Reduces colorectal cancer risk; improves blood sugar; lowers LDL; weight management.",foods:[{n:"Lentils",t:"Legumes",s:"half cup",v:"8 g",note:"Highest per serving."},{n:"Black beans",t:"Legumes",s:"half cup",v:"7.5 g"},{n:"Oats",t:"Grains",s:"half cup dry",v:"4 g"},{n:"Raspberries",t:"Fruits",s:"1 cup",v:"8 g"},{n:"Avocado",t:"Fruits",s:"half medium",v:"5 g"}],rda:{female:{"50-60":"25 g/day","61-70":"22 g/day","71+":"22 g/day"},male:{"50-60":"38 g/day","61-70":"30 g/day","71+":"28 g/day"}},deficiency:["Constipation","Elevated LDL","Poor blood sugar control"],enhances:["Gut microbiome diversity","SCFA production"],inhibits:["Extreme amounts reduce mineral absorption"]},
  {id:25,cat:"Macronutrient",name:"Complex Carbohydrates",aka:"Starches",func:"Primary fuel for brain and muscles; glycogen storage; spares protein from energy use.",benefits:"Sustained energy without spikes; athletic performance; brain function.",foods:[{n:"Sweet potato",t:"Vegetables",s:"1 medium",v:"26 g"},{n:"Oats",t:"Grains",s:"half cup dry",v:"27 g"},{n:"Quinoa",t:"Grains",s:"half cup",v:"20 g"},{n:"Brown rice",t:"Grains",s:"half cup",v:"22 g"},{n:"Corn",t:"Vegetables",s:"1 ear",v:"19 g"}],rda:{female:{"50-60":"45-65% of calories","61-70":"45-65% of calories","71+":"45-65% of calories"},male:{"50-60":"45-65% of calories","61-70":"45-65% of calories","71+":"45-65% of calories"}},deficiency:["Fatigue and brain fog","Muscle loss","Ketosis"],enhances:["B vitamins (metabolism)"],inhibits:["Refined versions spike glucose"]},
  {id:26,cat:"Phytonutrient",name:"Lycopene",aka:"",func:"Powerful antioxidant carotenoid; neutralizes free radicals; protects DNA; anti-inflammatory.",benefits:"Reduces prostate cancer risk; cardiovascular support; UV skin protection.",foods:[{n:"Tomatoes (cooked)",t:"Vegetables",s:"1 cup",v:"~7 mg",note:"Cooking increases availability."},{n:"Watermelon",t:"Fruits",s:"1 cup",v:"~6 mg"},{n:"Guava",t:"Fruits",s:"1 medium",v:"~5 mg"},{n:"Pink grapefruit",t:"Fruits",s:"half medium",v:"~1.8 mg"},{n:"Papaya",t:"Fruits",s:"1 cup",v:"~2.6 mg"}],rda:{female:{"50-60":"No RDA; ~10 mg/day beneficial","61-70":"No RDA; ~10 mg/day","71+":"No RDA; ~10 mg/day"},male:{"50-60":"No RDA; ~10 mg/day beneficial","61-70":"No RDA; ~10 mg/day","71+":"No RDA; ~10 mg/day"}},deficiency:["Increased oxidative stress"],enhances:["Fat (olive oil)","Heat (cooking)"],inhibits:["Raw = lower bioavailability"]},
  {id:27,cat:"Phytonutrient",name:"Quercetin",aka:"",func:"Flavonoid antioxidant; anti-inflammatory; antihistamine; supports immune function.",benefits:"Reduces allergy symptoms; cardiovascular support; antiviral properties.",foods:[{n:"Capers",t:"Vegetables",s:"1 tbsp",v:"~65 mg",note:"Highest known source."},{n:"Red onions",t:"Vegetables",s:"half cup",v:"~20 mg"},{n:"Apples",t:"Fruits",s:"1 medium",v:"~10 mg"},{n:"Kale",t:"Vegetables",s:"1 cup",v:"~7 mg"},{n:"Blueberries",t:"Fruits",s:"1 cup",v:"~7 mg"}],rda:{female:{"50-60":"No RDA; 500-1,000 mg studied","61-70":"No RDA; 500-1,000 mg","71+":"No RDA; 500-1,000 mg"},male:{"50-60":"No RDA; 500-1,000 mg studied","61-70":"No RDA; 500-1,000 mg","71+":"No RDA; 500-1,000 mg"}},deficiency:["Increased inflammation"],enhances:["Vitamin C (synergy)","Bromelain"],inhibits:["May interact with blood thinners"]},
  {id:28,cat:"Phytonutrient",name:"Resveratrol",aka:"",func:"Polyphenol antioxidant; activates sirtuins; anti-inflammatory; cardioprotective.",benefits:"Cardiovascular protection; anti-aging potential; insulin sensitivity; neuroprotective.",foods:[{n:"Red grapes",t:"Fruits",s:"1 cup",v:"~0.5 mg"},{n:"Blueberries",t:"Fruits",s:"1 cup",v:"~0.7 mg"},{n:"Peanuts",t:"Nuts",s:"1 oz",v:"~0.1 mg"},{n:"Cocoa",t:"Other",s:"1 tbsp",v:"~0.02 mg"}],rda:{female:{"50-60":"No RDA; 10-500 mg studied","61-70":"No RDA; 10-500 mg","71+":"No RDA; 10-500 mg"},male:{"50-60":"No RDA; 10-500 mg studied","61-70":"No RDA; 10-500 mg","71+":"No RDA; 10-500 mg"}},deficiency:["Increased oxidative stress"],enhances:["Quercetin (synergistic)"],inhibits:["High doses may affect estrogen conditions"]},
  {id:29,cat:"Phytonutrient",name:"Sulforaphane",aka:"",func:"Activates Nrf2 pathway for detoxification; powerful anti-cancer and anti-inflammatory.",benefits:"Anti-cancer activity; liver detox; neuroprotective; gut health.",foods:[{n:"Broccoli sprouts",t:"Vegetables",s:"1 cup",v:"~70 mg",note:"10x more than mature broccoli."},{n:"Broccoli",t:"Vegetables",s:"half cup",v:"~7 mg"},{n:"Brussels sprouts",t:"Vegetables",s:"half cup",v:"~5 mg"},{n:"Kale",t:"Vegetables",s:"1 cup",v:"~3 mg"},{n:"Cabbage",t:"Vegetables",s:"half cup",v:"~3 mg"}],rda:{female:{"50-60":"No RDA; ~10-100 mg estimated","61-70":"No RDA; ~10-100 mg","71+":"No RDA; ~10-100 mg"},male:{"50-60":"No RDA; ~10-100 mg estimated","61-70":"No RDA; ~10-100 mg","71+":"No RDA; ~10-100 mg"}},deficiency:["Reduced detoxification"],enhances:["Myrosinase (raw cruciferous)","Mustard seed"],inhibits:["Cooking destroys myrosinase"]},
  {id:30,cat:"Phytonutrient",name:"Anthocyanins",aka:"",func:"Blue/red/purple pigments; potent antioxidants; anti-inflammatory; insulin sensitivity; brain health.",benefits:"Reduces cognitive decline; cardiovascular protection; supports vision.",foods:[{n:"Blueberries",t:"Fruits",s:"1 cup",v:"~150 mg"},{n:"Blackberries",t:"Fruits",s:"1 cup",v:"~100 mg"},{n:"Red cabbage",t:"Vegetables",s:"half cup",v:"~50 mg"},{n:"Purple sweet potato",t:"Vegetables",s:"1 medium",v:"~80 mg"},{n:"Eggplant",t:"Vegetables",s:"half cup",v:"~30 mg (skin)"}],rda:{female:{"50-60":"No RDA; ~50-200 mg estimated","61-70":"No RDA; ~50-200 mg","71+":"No RDA; ~50-200 mg"},male:{"50-60":"No RDA; ~50-200 mg estimated","61-70":"No RDA; ~50-200 mg","71+":"No RDA; ~50-200 mg"}},deficiency:["Increased oxidative stress"],enhances:["Vitamin C (synergy)"],inhibits:["Heat reduces content"]},
  {id:31,cat:"Phytonutrient",name:"Beta-Glucan",aka:"",func:"Soluble polysaccharide; activates immune cells; lowers LDL; modulates blood sugar.",benefits:"Lowers LDL (FDA-approved at 3 g/day); reduces glucose spikes; immune activation.",foods:[{n:"Oats",t:"Grains",s:"half cup dry",v:"~2 g",note:"FDA claim: 3 g/day."},{n:"Barley",t:"Grains",s:"half cup",v:"~2.5 g"},{n:"Shiitake mushrooms",t:"Vegetables",s:"half cup",v:"~0.5 g"},{n:"Rye",t:"Grains",s:"1 slice",v:"~0.8 g"}],rda:{female:{"50-60":"No RDA; 3 g/day for cholesterol","61-70":"No RDA; 3 g/day","71+":"No RDA; 3 g/day"},male:{"50-60":"No RDA; 3 g/day for cholesterol","61-70":"No RDA; 3 g/day","71+":"No RDA; 3 g/day"}},deficiency:["Elevated LDL","Reduced immunity"],enhances:["Fiber fermentation (SCFAs)"],inhibits:["Refined processing removes it"]},
  {id:32,cat:"Phytonutrient",name:"Curcumin",aka:"",func:"Active polyphenol in turmeric; inhibits NF-kB; antioxidant; supports gut and brain health.",benefits:"Anti-inflammatory; may reduce arthritis pain; neuroprotective; potential anti-cancer.",foods:[{n:"Turmeric",t:"Other",s:"1 tsp",v:"~200 mg",note:"Always pair with black pepper."},{n:"Curry powder",t:"Other",s:"1 tsp",v:"~50-100 mg"}],rda:{female:{"50-60":"No RDA; 500-2,000 mg extract studied","61-70":"No RDA; 500-2,000 mg","71+":"No RDA; 500-2,000 mg"},male:{"50-60":"No RDA; 500-2,000 mg extract studied","61-70":"No RDA; 500-2,000 mg","71+":"No RDA; 500-2,000 mg"}},deficiency:["No acute deficiency"],enhances:["Piperine (black pepper x20)","Fat (fat-soluble)","Heat"],inhibits:["Poor bioavailability without piperine"]}
];

const catOrder = ["Vitamin","Mineral","Macronutrient","Phytonutrient"];
const catNames = {Vitamin:"Vitamins",Mineral:"Minerals",Macronutrient:"Macronutrients",Phytonutrient:"Phytonutrients"};
const foodTypes = ["all","Vegetables","Fruits","Dairy","Meat","Seafood","Legumes","Grains","Nuts","Eggs","Oils","Other"];
const foodLabels = {all:"All Foods",Vegetables:"Vegetables",Fruits:"Fruits",Dairy:"Dairy",Meat:"Meat & Poultry",Seafood:"Seafood",Legumes:"Legumes",Grains:"Grains & Seeds",Nuts:"Nuts",Eggs:"Eggs",Oils:"Oils & Fats",Other:"Other"};

const themes = {
  sage:{primary:"#4a9e8e",light:"#f5faf8",mid:"#c2ddd6",dark:"#3a8a7a",badgeBg:"#eaf5f1",badgeText:"#3a7a6a",hoverBg:"#eef6f3",contentBg:"#f5f7f6"},
  slate:{primary:"#6a8eaa",light:"#f5f8fb",mid:"#bcd5ee",dark:"#5a7e9a",badgeBg:"#eaf0f6",badgeText:"#4a6e88",hoverBg:"#edf2f7",contentBg:"#f5f6f8"},
  clay:{primary:"#b08860",light:"#faf8f5",mid:"#dcc8aa",dark:"#9a7850",badgeBg:"#f5efe6",badgeText:"#7a6040",hoverBg:"#f6f2ec",contentBg:"#f7f6f4"}
};

// ─── SETTINGS ICON SVG ───
const GearIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
);
const PrintIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
);

// ─── MAIN APP ───
export default function NutrientExplorer() {
  const nav = useNavigate();
  const [activeCat, setActiveCat] = useState("all");
  const [foodFilter, setFoodFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sex, setSex] = useState("female");
  const [age, setAge] = useState("50-60");
  const [theme, setTheme] = useState("sage");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalNutrient, setModalNutrient] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  const t = themes[theme];

  useEffect(() => {
    const ck = () => setIsMobile(window.innerWidth <= 820);
    ck(); window.addEventListener("resize", ck);
    return () => window.removeEventListener("resize", ck);
  }, []);

  useEffect(() => {
    const h = (e) => { if (!e.target.closest(".settings-wrap")) setSettingsOpen(false); };
    document.addEventListener("click", h);
    return () => document.removeEventListener("click", h);
  }, []);

  const filtered = nutrients.filter((n) => {
    const mc = activeCat === "all" || n.cat === activeCat;
    const mf = foodFilter === "all" || n.foods.some((f) => f.t === foodFilter);
    const q = search.toLowerCase();
    const ms = !q || n.name.toLowerCase().includes(q) || (n.aka && n.aka.toLowerCase().includes(q)) || n.func.toLowerCase().includes(q) || n.foods.some((f) => f.n.toLowerCase().includes(q));
    return mc && mf && ms;
  });

  const grouped = {};
  catOrder.forEach((c) => { grouped[c] = []; });
  filtered.forEach((n) => { (grouped[n.cat] || (grouped[n.cat] = [])).push(n); });

  const navigateCat = (cat) => { setActiveCat(cat); setDrawerOpen(false); };

  // ── SIDEBAR CONTENT ──
  const sidebarContent = (
    <div>
      <div style={{ fontSize: ".68rem", textTransform: "uppercase", letterSpacing: ".08em", color: "#aaa", fontWeight: 700, padding: "8px 16px 4px" }}>Categories</div>
      <CatBtn label="All Nutrients" active={activeCat === "all"} color={t.primary} onClick={() => navigateCat("all")} />
      {catOrder.map((c) => (
        <CatBtn key={c} label={catNames[c]} active={activeCat === c} color={t.primary} onClick={() => navigateCat(c)} />
      ))}
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: "'Segoe UI',system-ui,sans-serif", color: "#555" }}>
      {/* ── HEADER ── */}
      <header style={{ background: "#fff", borderBottom: "1px solid #e8eeec", position: "sticky", top: 0, zIndex: 100, padding: "10px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ flexShrink: 0, whiteSpace: "nowrap" }}>
            <div onClick={()=>nav('/')} style={{display:"inline-flex",alignItems:"center",gap:4,fontSize:".72rem",color:"#999",cursor:"pointer",marginBottom:2}}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>All Apps</div>
            <div><span style={{ fontSize: "1.95rem", fontWeight: 900, letterSpacing: "-.03em", color: "#0d7a5f" }}>Nutrient</span>
            <span style={{ fontSize: "1.15rem", fontWeight: 500, color: "#888" }}>Explorer</span></div>
          </div>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 10, minWidth: 0, paddingLeft: 14 }}>
            <select value={foodFilter} onChange={(e) => setFoodFilter(e.target.value)} style={{ padding: "7px 10px", border: "1.5px solid #dce4e1", borderRadius: 8, fontSize: ".83rem", color: "#555", outline: "none", background: "#fff", minWidth: 120 }}>
              {foodTypes.map((ft) => <option key={ft} value={ft}>{foodLabels[ft]}</option>)}
            </select>
            {!isMobile && (
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search nutrients or foods\u2026" style={{ flex: 1, maxWidth: 400, padding: "7px 14px", border: "1.5px solid #dce4e1", borderRadius: 8, fontSize: ".88rem", outline: "none", color: "#555", boxSizing: "border-box" }} />
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 2, flexShrink: 0 }}>
            <div className="settings-wrap" style={{ position: "relative" }} onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setSettingsOpen(!settingsOpen)} style={{ width: 34, height: 34, borderRadius: 8, background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: t.primary }}><GearIcon /></button>
              {settingsOpen && (
                <div style={{ position: "absolute", right: 0, top: 40, background: "#fff", border: "1px solid #e4e8e6", borderRadius: 10, padding: "12px 14px", boxShadow: "0 6px 24px rgba(0,0,0,.1)", whiteSpace: "nowrap", zIndex: 200 }}>
                  <div style={{ fontSize: ".68rem", color: "#aaa", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 8 }}>Theme Color</div>
                  <div style={{ display: "flex", gap: 12 }}>
                    {Object.entries(themes).map(([k, v]) => (
                      <div key={k} onClick={() => { setTheme(k); setSettingsOpen(false); }} style={{ width: 26, height: 26, borderRadius: "50%", background: v.primary, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transform: theme === k ? "scale(1.15)" : "none", transition: "transform .15s" }}>
                        {theme === k && <span style={{ color: "#fff", fontSize: ".65rem", fontWeight: 800 }}>{"\u2713"}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {isMobile && (
              <button onClick={() => setDrawerOpen(true)} style={{ display: "flex", flexDirection: "column", gap: 4, width: 34, height: 34, background: "#f5f8f7", border: "1.5px solid #e0e8e5", borderRadius: 8, cursor: "pointer", padding: 7, alignItems: "stretch", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ height: 2, background: "#888", borderRadius: 2 }} /><span style={{ height: 2, background: "#888", borderRadius: 2 }} /><span style={{ height: 2, background: "#888", borderRadius: 2 }} />
              </button>
            )}
          </div>
        </div>
        {isMobile && (
          <div style={{ marginTop: 8 }}>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search nutrients or foods\u2026" style={{ width: "100%", padding: "7px 14px", border: "1.5px solid #dce4e1", borderRadius: 8, fontSize: ".88rem", outline: "none", color: "#555", boxSizing: "border-box" }} />
          </div>
        )}
      </header>

      {/* ── MOBILE DRAWER ── */}
      {drawerOpen && <div onClick={() => setDrawerOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.3)", zIndex: 300 }} />}
      <div style={{ position: "fixed", top: 0, left: drawerOpen ? 0 : -280, width: 260, height: "100vh", background: "#fff", zIndex: 400, boxShadow: "4px 0 20px rgba(0,0,0,.12)", transition: "left .25s", overflowY: "auto", padding: "14px 0" }}>
        <div style={{ padding: "10px 16px", borderBottom: "1px solid #eaf0ed", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: ".84rem", fontWeight: 700, color: "#333" }}>Categories</span>
          <button onClick={() => setDrawerOpen(false)} style={{ width: 26, height: 26, borderRadius: 6, background: "#f5f7f6", border: "1px solid #e4e8e6", cursor: "pointer", fontSize: ".85rem", color: "#888", display: "flex", alignItems: "center", justifyContent: "center" }}>{"\u2715"}</button>
        </div>
        {sidebarContent}
      </div>

      {/* ── MAIN LAYOUT ── */}
      <div style={{ display: "flex", minHeight: "calc(100vh - 53px)" }}>
        {!isMobile && (
          <aside style={{ width: 190, minWidth: 190, background: "#fff", borderRight: "1px solid #eaf0ed", position: "sticky", top: 53, height: "calc(100vh - 53px)", overflowY: "auto", padding: "14px 0" }}>
            {sidebarContent}
          </aside>
        )}
        <main style={{ flex: 1, background: t.contentBg, overflowY: "auto" }}>
          {/* Profile bar */}
          <div style={{ background: "#fff", borderBottom: "1px solid #eaf0ed", padding: "10px 24px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <label style={{ fontSize: ".74rem", fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: ".05em" }}>
              Sex <select value={sex} onChange={(e) => setSex(e.target.value)} style={{ padding: "5px 8px", border: "1.5px solid #dce4e1", borderRadius: 6, fontSize: ".84rem", color: "#555", background: "#fff", outline: "none", marginLeft: 4 }}>
                <option value="female">Female</option><option value="male">Male</option>
              </select>
            </label>
            <label style={{ fontSize: ".74rem", fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: ".05em" }}>
              Age <select value={age} onChange={(e) => setAge(e.target.value)} style={{ padding: "5px 8px", border: "1.5px solid #dce4e1", borderRadius: 6, fontSize: ".84rem", color: "#555", background: "#fff", outline: "none", marginLeft: 4 }}>
                <option value="50-60">50-60</option><option value="61-70">61-70</option><option value="71+">71+</option>
              </select>
            </label>
            <div style={{ marginLeft: "auto", fontSize: ".82rem", color: "#aaa" }}>Showing <span style={{ color: t.primary, fontWeight: 600 }}>{filtered.length}</span> of <span style={{ color: t.primary, fontWeight: 600 }}>{nutrients.length}</span></div>
          </div>
          {/* Content */}
          <div style={{ padding: "20px 24px" }}>
            {filtered.length === 0 && <div style={{ background: "#fff", borderRadius: 10, padding: "48px 20px", fontSize: ".9rem", color: "#aaa", textAlign: "center", boxShadow: "0 1px 4px rgba(0,0,0,.05)" }}>No nutrients match your search or filters.</div>}
            {catOrder.map((cat) => {
              const items = grouped[cat];
              if (!items || !items.length) return null;
              return (
                <div key={cat} style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: ".74rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 8, color: t.primary }}>{catNames[cat]}</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 12 }}>
                    {items.map((n) => <NutrientCard key={n.id} nutrient={n} theme={t} onClick={() => setModalNutrient(n)} />)}
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      {/* ── MODAL ── */}
      {modalNutrient && <NutrientModal nutrient={modalNutrient} sex={sex} age={age} theme={t} onClose={() => setModalNutrient(null)} />}
    </div>
  );
}

// ─── SIDEBAR CATEGORY BUTTON ───
function CatBtn({ label, active, color, onClick }) {
  return (
    <button onClick={onClick} style={{ display: "block", width: "100%", textAlign: "left", padding: "8px 16px", border: "none", background: "none", cursor: "pointer", fontSize: ".84rem", color: active ? color : "#888", fontWeight: active ? 600 : 400, borderLeft: `3px solid ${active ? color : "transparent"}`, transition: "all .15s" }}>{label}</button>
  );
}

// ─── NUTRIENT CARD ───
function NutrientCard({ nutrient, theme, onClick }) {
  return (
    <div onClick={onClick} style={{ background: "#fff", borderRadius: 10, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,.05)", borderTop: `2.5px solid ${theme.primary}`, cursor: "pointer", display: "flex", flexDirection: "column", transition: "box-shadow .15s, transform .15s" }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,.08)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,.05)"; e.currentTarget.style.transform = "none"; }}>
      <div style={{ padding: "13px 15px", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: ".66rem", textTransform: "uppercase", letterSpacing: ".07em", fontWeight: 600, marginBottom: 2, color: theme.primary }}>{nutrient.cat}</div>
        <div style={{ fontSize: ".92rem", fontWeight: 600, color: "#333", lineHeight: 1.3 }}>{nutrient.name}</div>
        {nutrient.aka && <div style={{ fontSize: ".74rem", color: "#aaa", marginTop: 1 }}>{nutrient.aka}</div>}
        <div style={{ fontSize: ".8rem", color: "#555", marginTop: 5, lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden", flex: 1 }}>{nutrient.func}</div>
      </div>
      <div style={{ padding: "0 15px 12px", display: "flex", alignItems: "center", gap: 6 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, flex: 1, minWidth: 0 }}>
          {nutrient.foods.slice(0, 3).map((f, i) => (
            <span key={i} style={{ background: theme.badgeBg, color: theme.badgeText, borderRadius: 16, padding: "2px 8px", fontSize: ".7rem", fontWeight: 500, whiteSpace: "nowrap" }}>{f.n}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── NUTRIENT DETAIL MODAL ───
function NutrientModal({ nutrient, sex, age, theme, onClose }) {
  const n = nutrient;
  const rv = (n.rda[sex] && n.rda[sex][age]) || "--";
  const sexLabel = sex === "female" ? "Women" : "Men";

  const Sec = ({ title, children }) => (
    <div style={{ padding: "16px 0" }}>
      <div style={{ fontSize: ".78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "#888", marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: ".86rem", color: "#555", lineHeight: 1.65 }}>{children}</div>
    </div>
  );

  const ListSec = ({ title, items, sub }) => (
    <div style={{ padding: "16px 0" }}>
      <div style={{ fontSize: ".78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "#888", marginBottom: 6 }}>
        {title} {sub && <span style={{ fontWeight: 400, fontSize: ".7rem", color: "#999" }}>{sub}</span>}
      </div>
      {items.map((item, i) => (
        <div key={i} style={{ fontSize: ".84rem", color: "#555", lineHeight: 1.7, padding: "2px 0 2px 14px", position: "relative" }}>
          <span style={{ position: "absolute", left: 0, color: "#aaa", fontWeight: 700 }}>{"\u00B7"}</span>{item}
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.3)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: "#fff", borderRadius: 14, maxWidth: 620, width: "100%", maxHeight: "88vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,.18)", borderTop: `4px solid ${theme.primary}` }}>
        <div style={{ padding: "20px 24px 14px", borderBottom: "1px solid #dde2e0", position: "sticky", top: 0, background: "#fff", zIndex: 1 }}>
          <div style={{ position: "absolute", right: 18, top: 18, display: "flex", alignItems: "center", gap: 6 }}>
            <button onClick={onClose} style={{ background: "#f5f7f6", border: "1px solid #e4e8e6", borderRadius: "50%", width: 30, height: 30, cursor: "pointer", fontSize: ".95rem", color: "#888", display: "flex", alignItems: "center", justifyContent: "center" }}>{"\u2715"}</button>
          </div>
          <div style={{ fontSize: ".68rem", textTransform: "uppercase", letterSpacing: ".07em", fontWeight: 600, color: theme.primary, marginBottom: 2 }}>{n.cat}</div>
          <div style={{ fontSize: "1.15rem", fontWeight: 600, color: "#555" }}>{n.name}</div>
          {n.aka && <div style={{ fontSize: ".8rem", color: "#666", marginTop: 2 }}>Also known as: {n.aka}</div>}
        </div>
        <div style={{ padding: "0 24px 24px" }}>
          <Sec title="Function">{n.func}</Sec>
          <Sec title="Health Benefits">{n.benefits}</Sec>
          <div style={{ padding: "16px 0" }}>
            <div style={{ fontSize: ".78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "#888", marginBottom: 6 }}>Daily Target</div>
            <div style={{ fontSize: ".86rem", color: "#555", lineHeight: 1.65 }}>{sexLabel}, {age}: <span style={{ color: theme.primary, fontWeight: 600 }}>{rv}</span></div>
          </div>
          <div style={{ padding: "16px 0" }}>
            <div style={{ fontSize: ".78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "#888", marginBottom: 6 }}>Food Sources</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {n.foods.map((f, i) => (
                <div key={i} style={{ background: theme.contentBg, borderRadius: 7, padding: "7px 10px", fontSize: ".8rem" }}>
                  <strong style={{ display: "block", color: "#333", fontWeight: 600 }}>{f.n}</strong>
                  <span style={{ color: "#888" }}>{f.s}: {f.v}</span>
                  {f.note && <div style={{ color: theme.primary, fontSize: ".74rem", fontWeight: 600, marginTop: 1 }}>{f.note}</div>}
                </div>
              ))}
            </div>
          </div>
          <ListSec title="Deficiency Symptoms" items={n.deficiency} />
          <ListSec title="Enhancers" items={n.enhances} sub="(improves absorption)" />
          <ListSec title="Inhibitors" items={n.inhibits} sub="(reduces absorption)" />
        </div>
      </div>
    </div>
  );
}
