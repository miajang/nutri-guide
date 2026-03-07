import { useState, useEffect, useRef } from "react";
import BackToGallery from "../../components/BackToGallery";

/* == START: Category Labels ==
   Display names for condition categories
   == END: Category Labels == */
const catLabels={"Metabolic Risk":"Metabolic Risk",Cardiometabolic:"Cardiometabolic",Pulmonary:"Pulmonary","Cross-Cutting":"Systemic / Cross-Condition",Musculoskeletal:"Musculoskeletal",Sensory:"Sensory",Sleep:"Sleep","Mental Health":"Mental Health"};

/* == START: Conditions Data (15 conditions) ==
   Edit: connection[] = two paragraphs each
   Pattern: [what it is + aging], [mechanisms + consequences]
   == END: Conditions Data == */
const conditions=[
  {id:"obesity",name:"Obesity",cat:"Metabolic Risk",icon:"\u2696\uFE0F",pathways:["Metabolic dysregulation","Inflammation","Lipid metabolism"],connection:["Obesity occurs when energy intake consistently exceeds energy expenditure, leading to excess body fat accumulation. As we age, metabolism slows and muscle mass declines, making weight gain easier even if eating habits remain the same.","Excess abdominal (visceral) fat is biologically active and contributes to insulin resistance, elevated blood pressure, and abnormal cholesterol levels. Over time, this increases risk for diabetes, heart disease, and other cardiometabolic conditions."]},
  {id:"prediabetes",name:"Prediabetes",cat:"Metabolic Risk",icon:"\uD83D\uDD36",pathways:["Glucose regulation","Inflammation","Metabolic dysregulation"],connection:["Prediabetes means blood sugar levels are higher than normal but not yet high enough for a type 2 diabetes diagnosis. It becomes increasingly common after age 45 as cells gradually lose sensitivity to insulin \u2014 the hormone that moves glucose from blood into cells for energy.","Excess visceral fat, chronic low-grade inflammation, and reduced physical activity all accelerate this insulin resistance. Without intervention, approximately 70% of people with prediabetes eventually develop type 2 diabetes \u2014 but dietary changes with modest weight loss can reduce that progression risk by up to 58%."]},
  {id:"dm2",name:"Type 2 Diabetes",cat:"Metabolic Risk",icon:"\uD83E\uDE78",pathways:["Glucose regulation","Inflammation","Oxidative stress"],connection:["Type 2 diabetes develops when the body can no longer use insulin effectively and, over time, can no longer produce enough of it \u2014 causing blood sugar to remain chronically elevated. After age 50, the combination of declining muscle mass, reduced physical activity, and accumulated visceral fat makes the condition increasingly prevalent.","Persistent high blood sugar damages blood vessels and nerves throughout the body, driving a cascade of complications. Over time, poorly managed diabetes significantly increases risk of heart disease, kidney damage, vision loss, nerve pain, and impaired wound healing."]},
  {id:"htn",name:"High Blood Pressure",cat:"Cardiometabolic",icon:"\uD83D\uDC93",pathways:["Vascular function","Inflammation","Oxidative stress"],connection:["High blood pressure (hypertension) occurs when the force of blood against artery walls remains persistently elevated, increasing strain on the heart and blood vessels. With aging, arteries naturally become stiffer, making hypertension more common after age 50.","Excess sodium intake, vascular inflammation, excess body weight, and impaired blood vessel relaxation all contribute to elevated pressure. Long-term uncontrolled hypertension increases risk of heart attack, stroke, kidney disease, and cognitive decline."]},
  {id:"chol",name:"High Cholesterol",cat:"Cardiometabolic",icon:"\uD83E\uDEC0",pathways:["Lipid metabolism","Vascular function","Inflammation"],connection:["High cholesterol refers to elevated levels of LDL cholesterol or triglycerides in the blood, which contribute to plaque buildup inside arteries (atherosclerosis). As cholesterol metabolism changes with age, LDL levels may rise even without major dietary shifts.","Excess saturated fat intake, refined carbohydrates, inflammation, and excess visceral fat can worsen lipid abnormalities. Over time, arterial plaque accumulation increases risk of heart attack and stroke."]},
  {id:"metabolic",name:"Metabolic Syndrome",cat:"Cardiometabolic",icon:"\u26A1",pathways:["Metabolic dysregulation","Inflammation","Oxidative stress"],connection:["Metabolic syndrome is not a single disease but a cluster of interconnected risk factors \u2014 elevated blood sugar, high blood pressure, excess abdominal fat, high triglycerides, and low HDL cholesterol. After age 50, hormonal shifts, declining muscle mass, and accumulated visceral fat make this clustering increasingly common \u2014 affecting roughly one in three U.S. adults.","The underlying driver is insulin resistance amplified by visceral fat and chronic inflammation. Having three or more of these factors together dramatically multiplies risk beyond what any single factor would predict \u2014 significantly increasing the likelihood of type 2 diabetes, heart attack, stroke, and cardiovascular death. Addressing the shared metabolic root is more effective than treating each factor in isolation."]},
  {id:"cvd",name:"Heart Disease",cat:"Cardiometabolic",icon:"\u2764\uFE0F",pathways:["Vascular function","Inflammation","Oxidative stress","Lipid metabolism"],connection:["Heart disease (cardiovascular disease) encompasses conditions affecting the heart and blood vessels, most commonly coronary artery disease caused by atherosclerosis \u2014 the gradual buildup of plaque inside artery walls. The risk rises substantially with age as cumulative exposure to inflammation, high blood pressure, and elevated cholesterol takes its toll on vascular health.","Plaque buildup narrows arteries and restricts blood flow to the heart. When plaque ruptures, it can trigger a blood clot that blocks flow entirely, causing a heart attack. Chronic vascular inflammation, oxidative stress, and metabolic dysfunction all accelerate this process. Heart disease remains the leading cause of death in adults over 65."]},
  {id:"copd",name:"COPD / Chronic Lung Disease",cat:"Pulmonary",icon:"\uD83E\uDEC1",pathways:["Inflammation","Oxidative stress"],connection:["Chronic obstructive pulmonary disease (COPD) involves progressive airway inflammation and damage that makes breathing increasingly difficult. Most commonly caused by long-term smoking, COPD affects approximately 15% of adults over 65 and worsens with age as lung tissue loses elasticity.","The persistent work of breathing in COPD increases caloric demands while reduced appetite and medication side effects often decrease food intake. This imbalance leads to muscle wasting \u2014 particularly of the respiratory muscles \u2014 creating a cycle of declining lung function and physical capacity. Oxidative stress from ongoing airway inflammation further damages lung tissue."]},
  {id:"ckd",name:"Chronic Kidney Disease",cat:"Cardiometabolic",icon:"\uD83D\uDCA7",pathways:["Vascular function","Inflammation","Metabolic dysregulation"],connection:["Chronic kidney disease (CKD) is the gradual loss of kidney function over time. The kidneys filter waste, regulate fluid balance, and help control blood pressure. After age 60, kidney filtration capacity naturally declines, and conditions like diabetes and hypertension \u2014 both increasingly common with age \u2014 accelerate this loss.","As kidney function decreases, the body struggles to manage sodium, potassium, phosphorus, and fluid balance. This creates a feedback loop: impaired kidneys worsen blood pressure, and elevated blood pressure further damages kidneys. CKD often progresses silently for years before symptoms appear, making early dietary management especially important."]},
  {id:"inflam",name:"Chronic Inflammation",cat:"Cross-Cutting",icon:"\uD83D\uDD25",pathways:["Inflammation","Oxidative stress","Immune function"],connection:["Chronic low-grade inflammation (sometimes called \u201Cinflammaging\u201D) is a persistent, low-level immune activation that develops gradually with age. Unlike acute inflammation from an injury, this systemic inflammation operates silently \u2014 damaging tissues over months and years without obvious symptoms.","Visceral fat, poor diet quality, sedentary behavior, and disrupted gut microbiome all fuel this inflammatory state. Chronic inflammation is now recognized as the shared biological driver underlying most age-related diseases \u2014 including heart disease, diabetes, arthritis, depression, and cognitive decline. Reducing inflammatory triggers through dietary pattern changes addresses multiple conditions simultaneously."]},
  {id:"osteo",name:"Osteoporosis / Bone Loss",cat:"Musculoskeletal",icon:"\uD83E\uDDB4",pathways:["Bone metabolism","Inflammation"],connection:["Osteoporosis is a condition where bones become porous and fragile, significantly increasing fracture risk. Bone is living tissue that constantly remodels \u2014 old bone is broken down and new bone is formed. After age 50, this balance shifts: breakdown accelerates while formation slows, particularly in women after menopause due to declining estrogen.","Low calcium and vitamin D intake, insufficient protein, physical inactivity, and chronic inflammation all worsen bone loss. Fractures from osteoporosis \u2014 especially hip and spine \u2014 can lead to loss of independence, chronic pain, and increased mortality risk in older adults. The condition develops silently over decades, making nutritional prevention essential."]},
  {id:"arthritis",name:"Arthritis / Joint Pain",cat:"Musculoskeletal",icon:"\uD83E\uDDB5",pathways:["Inflammation","Oxidative stress"],connection:["Arthritis refers to joint inflammation that causes pain, stiffness, and reduced mobility. The most common form in adults over 50, osteoarthritis, results from gradual cartilage breakdown in weight-bearing joints. Rheumatoid arthritis, driven by autoimmune inflammation, can also worsen with age.","Joint inflammation is amplified by excess body weight (which increases mechanical stress), systemic inflammatory signals from visceral fat, and oxidative damage to cartilage. Over time, chronic joint inflammation reduces mobility, disrupts sleep, and limits physical activity \u2014 which in turn worsens metabolic health, creating a downward cycle."]},
  {id:"eye",name:"Age-Related Eye Disease",cat:"Sensory",icon:"\uD83D\uDC41\uFE0F",pathways:["Oxidative stress","Inflammation","Vascular function"],connection:["Age-related eye diseases \u2014 particularly macular degeneration (AMD) and cataracts \u2014 are leading causes of vision loss in adults over 60. AMD affects the macula, the central part of the retina responsible for sharp, detailed vision. Cataracts involve progressive clouding of the lens.","Both conditions are driven by cumulative oxidative damage to delicate eye structures. Years of light exposure, smoking, and insufficient antioxidant intake deplete the eye\u2019s natural protective pigments. The retina is especially vulnerable because of its high metabolic activity and constant exposure to light-generated free radicals. Left unaddressed, AMD can progress from mild visual distortion to significant central vision loss, affecting the ability to read, drive, and recognize faces."]},
  {id:"sleep",name:"Sleep Disorders / Insomnia",cat:"Sleep",icon:"\uD83D\uDE34",pathways:["Neurotransmitter function","Inflammation","Circadian regulation"],connection:["Chronic sleep difficulties \u2014 including trouble falling asleep, staying asleep, or waking unrefreshed \u2014 affect up to 50% of adults over 60. Sleep architecture changes naturally with age: deep sleep stages shorten, nighttime awakenings increase, and circadian rhythms shift earlier.","Sleep is regulated by neurotransmitters \u2014 particularly serotonin and melatonin \u2014 that are synthesized from dietary building blocks. Age-related declines in melatonin production, combined with medication effects, chronic pain, and stress, compound the problem. Poor sleep is not merely an inconvenience: it worsens inflammation, insulin resistance, blood pressure, and cognitive function."]},
  {id:"depression",name:"Depression / Low Mood",cat:"Mental Health",icon:"\uD83E\uDDE0",pathways:["Inflammation","Neurotransmitter function","Gut-brain axis"],connection:["Depression in adults over 50 often differs from younger-onset depression \u2014 it may present as persistent low energy, difficulty concentrating, social withdrawal, or loss of interest rather than overt sadness. It becomes more common with age due to life transitions, chronic disease burden, social isolation, and neurochemical changes.","The brain\u2019s neurotransmitter systems \u2014 particularly serotonin, dopamine, and norepinephrine \u2014 depend on specific dietary nutrients for synthesis and regulation. Low omega-3 status, B vitamin deficiencies, vitamin D insufficiency, and poor gut microbiome diversity are consistently linked to depressive symptoms. Chronic inflammation also directly impairs neurotransmitter production and signaling."]}
];

/* == START: Pathway Descriptions (11 pathways) ==
   Edit: two paragraphs each [normal process], [what goes wrong]
   == END: Pathway Descriptions == */
const pathwayDetails={
  "Inflammation":["Inflammation is the immune system\u2019s response to injury or threat. In its acute form, it\u2019s protective \u2014 fighting infections and healing wounds. The problem begins when this response never fully turns off.","Chronic low-grade inflammation persists silently, driven by visceral fat, poor diet, and sedentary behavior. Over time, it damages blood vessels, joints, and organs \u2014 accelerating heart disease, diabetes, arthritis, depression, and cognitive decline. It is the most common shared driver across age-related chronic conditions."],
  "Vascular function":["Vascular function refers to how well blood vessels expand, contract, and regulate blood flow. Healthy arteries are flexible and responsive, adjusting flow to meet the body\u2019s demands moment to moment.","With aging, arteries stiffen and the inner lining (endothelium) becomes damaged by inflammation, high blood pressure, and oxidative stress. This impairs the vessels\u2019 ability to relax and deliver oxygen efficiently \u2014 increasing risk of hypertension, heart attack, stroke, and kidney damage."],
  "Oxidative stress":["Oxidative stress occurs when the body produces more free radicals \u2014 unstable molecules that damage cells \u2014 than its antioxidant defenses can neutralize. Some free radical production is normal, a byproduct of energy metabolism.","When this balance is disrupted \u2014 by aging, chronic inflammation, visceral fat, smoking, and insufficient antioxidant intake \u2014 free radical damage accumulates. Unchecked oxidative stress damages DNA, proteins, and cell membranes throughout the body, contributing to arterial plaque formation, joint cartilage breakdown, retinal degeneration, and lung tissue damage."],
  "Lipid metabolism":["Lipid metabolism is how the body processes, transports, and uses fats and cholesterol. The liver produces cholesterol for cell membranes and hormones, while lipoproteins (LDL and HDL) shuttle it through the bloodstream.","When this system is disrupted \u2014 by excess saturated fat, inflammation, or insulin resistance \u2014 LDL particles increase and penetrate artery walls, triggering plaque buildup (atherosclerosis). Triglycerides rise, HDL drops, and the balance shifts toward cardiovascular damage."],
  "Glucose regulation":["Glucose regulation is how the body maintains stable blood sugar levels. After eating, the pancreas releases insulin to move glucose from the bloodstream into cells for energy. Between meals, the liver releases stored glucose to keep levels steady.","When cells become resistant to insulin \u2014 driven by visceral fat, inactivity, and inflammation \u2014 glucose accumulates in the blood. The pancreas compensates by producing more insulin until it can no longer keep up. This progression from insulin resistance to elevated blood sugar underlies prediabetes and type 2 diabetes."],
  "Metabolic dysregulation":["Metabolic dysregulation is a breakdown in how the body processes and uses energy from food. Normally, insulin moves glucose into cells and the liver manages fat and cholesterol production in balance.","When excess visceral fat and chronic inflammation disrupt this system, cells stop responding to insulin, the liver overproduces glucose and fat, and energy balance is lost. This self-reinforcing cycle underlies obesity, prediabetes, metabolic syndrome, and type 2 diabetes."],
  "Neurotransmitter function":["Neurotransmitters are chemical messengers that regulate mood, sleep, focus, and motivation. Serotonin supports emotional stability, dopamine drives motivation and reward, and melatonin controls the sleep-wake cycle.","These neurotransmitters are built from dietary amino acids \u2014 primarily tryptophan \u2014 with B vitamins and magnesium as essential cofactors. When nutritional building blocks are insufficient, or when chronic inflammation interferes with synthesis, neurotransmitter production declines."],
  "Bone metabolism":["Bone metabolism is the continuous cycle of bone breakdown and rebuilding that maintains skeletal strength. Specialized cells called osteoclasts remove old bone while osteoblasts form new bone \u2014 a process that renews the entire skeleton roughly every ten years.","After age 50, breakdown begins to outpace formation \u2014 especially in women after menopause when estrogen drops. Calcium, vitamin D, vitamin K2, magnesium, and protein each play distinct roles in this remodeling process. When any are insufficient, net bone loss accelerates, increasing fracture risk."],
  "Gut-brain axis":["The gut-brain axis is the bidirectional communication network between the digestive system and the brain, connected through the vagus nerve, immune signals, and microbial metabolites. The gut microbiome \u2014 trillions of bacteria \u2014 produces neurotransmitters and inflammatory molecules that directly influence brain function.","When gut microbial diversity declines \u2014 from poor diet, antibiotics, or aging \u2014 this communication is disrupted. Reduced production of short-chain fatty acids and serotonin precursors, combined with increased gut permeability, contributes to inflammation, mood disorders, and cognitive decline."],
  "Circadian regulation":["Circadian regulation is the body\u2019s internal 24-hour clock system that governs sleep-wake cycles, hormone release, body temperature, and metabolism. The master clock in the brain responds to light, while peripheral clocks in organs respond to meal timing.","With aging, circadian signals weaken \u2014 melatonin production declines, sleep phases shift earlier, and the system becomes more sensitive to disruption. Poor circadian alignment worsens sleep quality, insulin sensitivity, blood pressure regulation, and immune function."],
  "Immune function":["Immune function is the body\u2019s ability to defend against infections, eliminate damaged cells, and regulate inflammatory responses. A healthy immune system balances aggressive defense with precise control \u2014 attacking threats without damaging healthy tissue.","With aging (immunosenescence), this balance deteriorates: the immune system becomes simultaneously weaker at fighting new threats and more prone to chronic, low-grade inflammation. Zinc, vitamin D, selenium, and antioxidant nutrients support both sides of this equation."]
};

/* == START: Nutrients Data (14 nutrients) ==
   12 essential nutrients + 2 bioactive compounds
   Each: simple, detail, foods[], rda{}, foodAction, supp
   == END: Nutrients Data == */
const nutrients=[
  {id:"fiber",name:"Dietary Fiber",type:"nutrient",conditions:["obesity","prediabetes","dm2","chol","cvd","inflam","metabolic","ckd"],simple:"The single most impactful dietary change for metabolic health. Lowers LDL, slows glucose absorption, reduces appetite, and feeds beneficial gut bacteria.",detail:"Soluble fiber binds bile acids, lowering LDL. It slows glucose absorption, reducing spikes. Fermentation produces short-chain fatty acids that reduce inflammation. Most adults consume only 10\u201315g/day.",foods:[{n:"Lentils, cooked",s:"\u00BD cup",v:"~8 g"},{n:"Black beans",s:"\u00BD cup",v:"~7.5 g"},{n:"Oats, dry",s:"\u00BD cup",v:"~4 g",note:"Rich in beta-glucan for cholesterol."},{n:"Pear",s:"1 medium",v:"~5.5 g"},{n:"Chia seeds",s:"1 tbsp",v:"~5 g",note:"Both soluble and insoluble."}],rda:{female:{"50-60":"25 g/day","61-70":"22 g/day","71+":"22 g/day"},male:{"50-60":"38 g/day","61-70":"30 g/day","71+":"28 g/day"}},foodAction:"A half cup of lentils plus one pear provides more than half the daily fiber target. Increase fiber gradually \u2014 along with adequate water \u2014 to prevent bloating and support gut adaptation.",supp:"Psyllium husk 5\u201310 g/day. Start at 3 g/day."},
  {id:"omega3",name:"Omega-3 Fatty Acids",type:"nutrient",conditions:["chol","cvd","arthritis","depression","inflam","copd","eye","metabolic","dm2"],simple:"The broadest-acting anti-inflammatory nutrient. EPA and DHA support heart, joint, eye, and mental health simultaneously.",detail:"EPA and DHA are precursors to anti-inflammatory resolvins. EPA \u22651 g/day has antidepressant effects. At 2\u20134 g/day, omega-3s lower triglycerides 20\u201330%.",foods:[{n:"Salmon",s:"3 oz",v:"~1.8 g EPA+DHA",note:"Meets daily target in one serving."},{n:"Mackerel",s:"3 oz",v:"~1.0\u20131.5 g"},{n:"Sardines",s:"3 oz",v:"~1.1 g"},{n:"Flaxseeds",s:"1 tbsp",v:"~1.6 g ALA",note:"ALA converts at only 5\u201310%."},{n:"Walnuts",s:"1 oz",v:"~2.5 g ALA"}],rda:{female:{"50-60":"1.1 g ALA; 1\u20132 g EPA+DHA","61-70":"1.1 g ALA; 1\u20132 g EPA+DHA","71+":"1.1 g ALA; 1\u20132 g EPA+DHA"},male:{"50-60":"1.6 g ALA; 1\u20132 g EPA+DHA","61-70":"1.6 g ALA; 1\u20132 g EPA+DHA","71+":"1.6 g ALA; 1\u20132 g EPA+DHA"}},foodAction:"Aim for fatty fish (salmon, mackerel, sardines) 2\u20133 times per week to maintain consistent anti-inflammatory levels. Plant sources like flaxseeds and walnuts provide ALA, but conversion to the active forms EPA and DHA is limited \u2014 so fish or algae-based sources are preferred.",supp:"Fish oil 1,000\u20132,000 mg EPA+DHA/day. Algae-based DHA for plant alternative."},
  {id:"magnesium",name:"Magnesium",type:"nutrient",conditions:["htn","prediabetes","dm2","sleep","depression","cvd","inflam","metabolic"],simple:"Cofactor in 300+ reactions. Supports blood pressure, insulin sensitivity, sleep, and nerve signaling. Very common deficiency in adults 50+.",detail:"Required for glucose transport, vascular tone, serotonin/melatonin synthesis. ~50% of Americans don\u2019t meet daily needs.",foods:[{n:"Pumpkin seeds",s:"1 oz",v:"~150 mg",note:"Most magnesium-dense food."},{n:"Swiss chard",s:"1 cup",v:"~150 mg"},{n:"Almonds",s:"1 oz",v:"~80 mg"},{n:"Black beans",s:"\u00BD cup",v:"~60 mg"},{n:"Quinoa",s:"\u00BD cup",v:"~60 mg"}],rda:{female:{"50-60":"320 mg/day","61-70":"320 mg/day","71+":"320 mg/day"},male:{"50-60":"420 mg/day","61-70":"420 mg/day","71+":"420 mg/day"}},foodAction:"One ounce of pumpkin seeds daily provides nearly half the magnesium target. Leafy greens, nuts, and legumes round out the rest \u2014 spreading intake across meals supports steady absorption and helps maintain stable blood sugar and blood pressure.",supp:"Magnesium glycinate/citrate 200\u2013400 mg/day."},
  {id:"vitd",name:"Vitamin D",type:"nutrient",conditions:["osteo","depression","inflam","arthritis","cvd","prediabetes","dm2","copd","ckd"],simple:"Functions as a hormone. Most prevalent deficiency in adults 50+, linked to bone loss, immune dysfunction, and depression.",detail:"Activates receptors in nearly every cell type. Skin synthesis declines with age. Affects up to 40% of U.S. adults.",foods:[{n:"Trout",s:"3 oz",v:"~645 IU",note:"Meets daily target under age 71."},{n:"Salmon",s:"3 oz",v:"~570 IU"},{n:"Mushrooms, UV",s:"\u00BD cup",v:"~366 IU"},{n:"Milk, fortified",s:"1 cup",v:"~120 IU"},{n:"Egg yolk",s:"1 large",v:"~44 IU"}],rda:{female:{"50-60":"600 IU/day","61-70":"600 IU/day","71+":"800 IU/day"},male:{"50-60":"600 IU/day","61-70":"600 IU/day","71+":"800 IU/day"}},foodAction:"Few foods provide enough vitamin D on their own \u2014 fatty fish (trout, salmon) are the richest sources, but most adults 50+ still fall short through diet alone. A blood test (25-hydroxyvitamin D) can determine your level, which guides whether supplementation is needed.",supp:"1,000\u20132,000 IU/day D3. Blood testing guides dosing."},
  {id:"potassium",name:"Potassium",type:"nutrient",conditions:["htn","cvd","dm2","ckd"],simple:"Primary counterbalance to sodium. Relaxes blood vessels and supports heart rhythm.",detail:"Promotes sodium excretion and vessel relaxation. In moderate\u2013advanced CKD, must be monitored.",foods:[{n:"Spinach, cooked",s:"1 cup",v:"~840 mg",note:"Richest potassium source."},{n:"Sweet potato",s:"1 medium",v:"~540 mg"},{n:"White beans",s:"\u00BD cup",v:"~500 mg"},{n:"Banana",s:"1 medium",v:"~420 mg"},{n:"Avocado",s:"\u00BD medium",v:"~350 mg"}],rda:{female:{"50-60":"2,600 mg/day","61-70":"2,600 mg/day","71+":"2,600 mg/day"},male:{"50-60":"3,400 mg/day","61-70":"3,400 mg/day","71+":"3,400 mg/day"}},foodAction:"Include one potassium-rich food at each meal \u2014 spinach, sweet potato, beans, or avocado are among the best sources. Whole food sources are preferred over supplements, and potassium-rich foods naturally displace high-sodium choices, supporting blood pressure from both directions.",supp:null},
  {id:"calcium",name:"Calcium",type:"nutrient",conditions:["osteo","cvd","htn","dm2"],simple:"Primary structural mineral in bones. Food sources preferred over high-dose supplements.",detail:"99% of bone mineral. Absorption decreases with age, requires vitamin D. Spread intake across meals.",foods:[{n:"Yogurt, plain",s:"1 cup",v:"~415 mg",note:">1/3 of daily target."},{n:"Sardines+bones",s:"3 oz",v:"~325 mg"},{n:"Milk",s:"1 cup",v:"~300 mg"},{n:"Tofu, calcium-set",s:"\u00BD cup",v:"~200 mg"},{n:"Kale, cooked",s:"1 cup",v:"~180 mg"}],rda:{female:{"50-60":"1,200 mg/day","61-70":"1,200 mg/day","71+":"1,200 mg/day"},male:{"50-60":"1,000 mg/day","61-70":"1,000 mg/day","71+":"1,200 mg/day"}},foodAction:"Spread 2\u20133 calcium-rich servings across the day rather than consuming them all at once \u2014 the body absorbs calcium more efficiently in smaller amounts (under ~500 mg at a time). Pairing calcium foods with vitamin D sources enhances absorption.",supp:"Calcium citrate/carbonate. Max 500 mg per dose."},
  {id:"antioxidants",name:"Antioxidants (Vitamins C & E)",type:"nutrient",conditions:["eye","arthritis","copd","inflam","cvd","metabolic","ckd"],simple:"Primary free radical neutralizers protecting eyes, lungs, joints, and arteries.",detail:"Vitamin C regenerates E, supports collagen, enhances iron absorption. Antioxidants reduced advanced AMD progression by 25% (AREDS2).",foods:[{n:"Red bell peppers",s:"\u00BD cup",v:"~95 mg C",note:"Full daily C target."},{n:"Strawberries",s:"1 cup",v:"~85 mg C"},{n:"Kiwi",s:"1 medium",v:"~71 mg C"},{n:"Sunflower seeds",s:"1 oz",v:"~7.4 mg E"},{n:"Almonds",s:"1 oz",v:"~7.3 mg E",note:"~1/2 daily E target."}],rda:{female:{"50-60":"75 mg C; 15 mg E/day","61-70":"75 mg C; 15 mg E/day","71+":"75 mg C; 15 mg E/day"},male:{"50-60":"90 mg C; 15 mg E/day","61-70":"90 mg C; 15 mg E/day","71+":"90 mg C; 15 mg E/day"}},foodAction:"Eat colorful produce daily \u2014 red, orange, and yellow fruits and vegetables are the richest sources. Vitamin C is best obtained from raw or lightly cooked produce (heat reduces it), while vitamin E from nuts and seeds is well-absorbed when eaten with dietary fat.",supp:"C 250\u2013500 mg/day. E above 400 IU \u2014 discuss with provider."},
  {id:"vitb12",name:"Vitamin B12",type:"nutrient",conditions:["depression","cvd","inflam"],simple:"Essential for nerves and red blood cells. Adults 50+ should use fortified foods or supplements.",detail:"Absorption declines with age. Metformin and PPIs further reduce it.",foods:[{n:"Clams",s:"3 oz",v:"~84 mcg"},{n:"Beef liver",s:"3 oz",v:"~70 mcg"},{n:"Salmon",s:"3 oz",v:"~4.9 mcg",note:"2x daily requirement."},{n:"Milk",s:"1 cup",v:"~1.2 mcg"},{n:"Eggs",s:"2 large",v:"~1.0 mcg"}],rda:{female:{"50-60":"2.4 mcg/day","61-70":"2.4 mcg/day","71+":"2.4 mcg/day"},male:{"50-60":"2.4 mcg/day","61-70":"2.4 mcg/day","71+":"2.4 mcg/day"}},foodAction:"After age 50, the body\u2019s ability to absorb B12 from food declines significantly due to reduced stomach acid production. Fortified foods or supplements in crystalline form bypass this limitation and are better absorbed than B12 from meat or dairy alone.",supp:"Sublingual/oral B12 500\u20131,000 mcg/day."},
  {id:"folate",name:"Folate (Vitamin B9)",type:"nutrient",conditions:["cvd","depression","inflam"],simple:"Works with B12 to lower homocysteine. Supports neurotransmitter production.",detail:"Elevated homocysteine is linked to cardiovascular disease and depression.",foods:[{n:"Edamame",s:"\u00BD cup",v:"~240 mcg DFE",note:">1/2 daily target."},{n:"Spinach, cooked",s:"\u00BD cup",v:"~130 mcg"},{n:"Black-eyed peas",s:"\u00BD cup",v:"~105 mcg"},{n:"Asparagus",s:"4 spears",v:"~89 mcg"},{n:"Avocado",s:"\u00BD medium",v:"~59 mcg"}],rda:{female:{"50-60":"400 mcg DFE/day","61-70":"400 mcg DFE/day","71+":"400 mcg DFE/day"},male:{"50-60":"400 mcg DFE/day","61-70":"400 mcg DFE/day","71+":"400 mcg DFE/day"}},foodAction:"Dark leafy greens and legumes at most meals provide a strong folate foundation. Folate is sensitive to heat \u2014 lightly cooking greens preserves more than boiling, and pairing with vitamin B12-rich foods supports the methylation cycle they share.",supp:"Folic acid 400 mcg. Upper limit 1,000 mcg/day."},
  {id:"tryptophan",name:"Tryptophan & Melatonin Precursors",type:"nutrient",conditions:["sleep","depression"],simple:"Dietary amino acid used to make serotonin and melatonin.",detail:"Essential \u2014 must come from food. Conversion requires B6 and magnesium. Tart cherries are a natural melatonin source.",foods:[{n:"Turkey",s:"3 oz",v:"~350 mg"},{n:"Pumpkin seeds",s:"1 oz",v:"~160 mg"},{n:"Eggs",s:"2 large",v:"~170 mg"},{n:"Warm milk",s:"1 cup",v:"~110 mg",note:"Genuine nutritional support."},{n:"Tart cherry juice",s:"\u00BD cup",v:"Natural melatonin",note:"Rare dietary melatonin source."}],rda:{female:{"50-60":"~5 mg/kg/day","61-70":"~5 mg/kg/day","71+":"~5 mg/kg/day"},male:{"50-60":"~5 mg/kg/day","61-70":"~5 mg/kg/day","71+":"~5 mg/kg/day"}},foodAction:"Pair tryptophan-rich foods (turkey, pumpkin seeds, eggs) with a complex carbohydrate in the evening \u2014 the carb triggers insulin, which helps tryptophan cross into the brain for serotonin and melatonin production. Tart cherry juice is one of the few natural dietary sources of melatonin itself.",supp:"Melatonin 0.5\u20133 mg, 30\u201360 min before bed."},
  {id:"vitk2",name:"Vitamin K2",type:"nutrient",conditions:["osteo","cvd"],simple:"Directs calcium to bones, away from arteries \u2014 the missing link in calcium supplementation safety.",detail:"Activates osteocalcin (bone) and matrix Gla-protein (arteries). High K2 intake = less arterial calcification.",foods:[{n:"Natto",s:"3 oz",v:"~850 mcg MK-7",note:"Richest K2 source."},{n:"Gouda",s:"1 oz",v:"~75 mcg"},{n:"Brie",s:"1 oz",v:"~57 mcg"},{n:"Egg yolk",s:"1 large",v:"~5 mcg"},{n:"Chicken liver",s:"3 oz",v:"~14 mcg"}],rda:{female:{"50-60":"90 mcg/day (total K)","61-70":"90 mcg/day","71+":"90 mcg/day"},male:{"50-60":"120 mcg/day (total K)","61-70":"120 mcg/day","71+":"120 mcg/day"}},foodAction:"Aged cheeses (Gouda, Brie) and fermented foods like natto are the best dietary K2 sources. Taking K2 alongside vitamin D3 is important \u2014 D3 increases calcium absorption, while K2 directs that calcium to bones and away from arteries.",supp:"K2 MK-7 100\u2013200 mcg/day. Affects warfarin \u2014 discuss with provider."},
  {id:"zinc",name:"Zinc",type:"nutrient",conditions:["inflam","depression","copd","ckd"],simple:"Essential for immune defense, wound healing, and neurotransmitter activity.",detail:"Required for 300+ enzymes. Deficiency linked to infections, poor appetite, depressive symptoms.",foods:[{n:"Oysters",s:"3 oz",v:"~74 mg",note:"Exceeds weekly requirement."},{n:"Beef, lean",s:"3 oz",v:"~7 mg"},{n:"Pumpkin seeds",s:"1 oz",v:"~2.2 mg"},{n:"Cashews",s:"1 oz",v:"~1.6 mg"},{n:"Chickpeas",s:"\u00BD cup",v:"~1.3 mg"}],rda:{female:{"50-60":"8 mg/day","61-70":"8 mg/day","71+":"8 mg/day"},male:{"50-60":"11 mg/day","61-70":"11 mg/day","71+":"11 mg/day"}},foodAction:"A varied diet with lean meats, legumes, and seeds generally covers zinc needs. Zinc from plant sources is less bioavailable due to phytates \u2014 soaking or sprouting beans and grains before cooking improves absorption significantly.",supp:"Zinc 8\u201315 mg/day. Above 25 mg/day can deplete copper."},
  {id:"lutein",name:"Lutein & Zeaxanthin",type:"bioactive",conditions:["eye","inflam"],simple:"Carotenoids that accumulate in the retina, protecting against oxidative damage and blue light.",detail:"AREDS2: lutein 10 mg + zeaxanthin 2 mg reduced advanced AMD by 26% in those with low dietary intake.",foods:[{n:"Kale, cooked",s:"\u00BD cup",v:"~10\u201312 mg",note:"Exceeds AREDS2 dose."},{n:"Spinach, cooked",s:"\u00BD cup",v:"~6\u20138 mg"},{n:"Collard greens",s:"\u00BD cup",v:"~7 mg"},{n:"Corn",s:"\u00BD cup",v:"~1 mg zeaxanthin"},{n:"Egg yolk",s:"1 large",v:"~0.2 mg",note:"Highly bioavailable."}],rda:{female:{"50-60":"No RDA; 6\u201310 mg/day in research","61-70":"No RDA; 6\u201310 mg/day","71+":"No RDA; 6\u201310 mg/day"},male:{"50-60":"No RDA; 6\u201310 mg/day in research","61-70":"No RDA; 6\u201310 mg/day","71+":"No RDA; 6\u201310 mg/day"}},foodAction:"A half cup of cooked kale or spinach daily meets research-supported intake levels for eye protection. These carotenoids are fat-soluble \u2014 cooking with olive oil or pairing with avocado significantly increases absorption into the bloodstream and retina.",supp:"Lutein 10 mg + zeaxanthin 2 mg/day (AREDS2 formula)."},
  {id:"curcumin",name:"Curcumin (Turmeric)",type:"bioactive",conditions:["arthritis","inflam","depression","metabolic"],simple:"One of the most studied natural anti-inflammatory agents. Meaningful joint pain reductions in trials.",detail:"Inhibits NF-\u03BAB, activates Nrf2. Black pepper enhances absorption ~20-fold.",foods:[{n:"Turmeric",s:"1 tsp",v:"~200 mg",note:"Always add black pepper."},{n:"Curry powder",s:"1 tsp",v:"~50\u2013100 mg"},{n:"Golden milk",s:"1 cup",v:"Variable"}],rda:{female:{"50-60":"No RDA; 500\u20131,000 mg extract studied","61-70":"No RDA; 500\u20131,000 mg","71+":"No RDA; 500\u20131,000 mg"},male:{"50-60":"No RDA; 500\u20131,000 mg extract studied","61-70":"No RDA; 500\u20131,000 mg","71+":"No RDA; 500\u20131,000 mg"}},foodAction:"Use turmeric generously in cooking, but always pair with black pepper \u2014 piperine in black pepper increases curcumin absorption by approximately 20-fold. Adding a source of fat (olive oil, coconut milk) further improves bioavailability since curcumin is fat-soluble.",supp:"Curcumin 500\u20131,000 mg/day with piperine. May interact with blood thinners."}
];

/* == START: Foods to Limit (8 categories) ==
   Each: conds[], food, reason
   == END: Foods to Limit == */
const foodsToLimit=[
  {conds:["htn","cvd","ckd"],food:"High-sodium processed, packaged, and restaurant foods",reason:"Raises blood pressure and increases kidney workload."},
  {conds:["chol","cvd","obesity","metabolic"],food:"Saturated fat\u2013heavy foods (processed meats, excess full-fat dairy, tropical oils)",reason:"Raises LDL and promotes vascular inflammation."},
  {conds:["prediabetes","dm2","obesity","metabolic","ckd"],food:"Refined carbohydrates and high added sugars",reason:"Drive glucose spikes and promote insulin resistance."},
  {conds:["inflam","arthritis","depression","metabolic"],food:"Ultra-processed foods and high omega-6 oils",reason:"Promote inflammation by displacing omega-3s."},
  {conds:["sleep"],food:"Caffeine after noon and alcohol before bed",reason:"Caffeine blocks adenosine; alcohol fragments sleep."},
  {conds:["osteo"],food:"Excessive alcohol and high sodium",reason:"Increase calcium excretion and impair bone remodeling."},
  {conds:["copd"],food:"Very large, high-carbohydrate meals",reason:"Produce more CO\u2082, worsening breathing."},
  {conds:["ckd"],food:"High-phosphorus processed foods",reason:"Damaged kidneys can\u2019t filter excess phosphorus."}
];

/* == START: HWI Brand Colors (permanent) ==
   No theme switcher — fixed brand identity
   == END: HWI Brand Colors == */
const t = {
  pri: "#2E7AD9",
  teal: "#47ADC3",
  orange: "#F79520",
  lt: "#EAF2FB",
  mid: "#ABCBF0",
  dk: "#1a5ba0",
  badge: "#D5E5F7",
  badgeTxt: "#1a5ba0",
  learn: "#5895E1",
  condBg: "#F9FAFB",
  hover: "#EAF2FB",
  contBg: "#F9FAFB"
};

const mutualExclusions={prediabetes:"dm2",dm2:"prediabetes"};

/* == START: SVG Nav Icons ==
   connection, nutrients, limit, supplements, chat, settings
   == END: SVG Nav Icons == */
const NavIcon = ({type, color}) => {
  const s = {width:16,height:16,stroke:color,fill:"none",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};
  if(type==="connection") return <svg viewBox="0 0 24 24" style={s}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>;
  if(type==="nutrients") return <svg viewBox="0 0 24 24" style={s}><circle cx="12" cy="12" r="9"/><line x1="12" y1="3" x2="12" y2="21"/><line x1="3" y1="12" x2="21" y2="12"/></svg>;
  if(type==="limit") return <svg viewBox="0 0 24 24" style={s}><circle cx="12" cy="12" r="9"/><line x1="5.7" y1="5.7" x2="18.3" y2="18.3"/></svg>;
  if(type==="supplements") return <svg viewBox="0 0 24 24" style={s}><rect x="6" y="2" width="12" height="20" rx="5"/><line x1="6" y1="12" x2="18" y2="12"/></svg>;
  if(type==="chat") return <svg viewBox="0 0 24 24" style={s}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
  if(type==="settings") return <svg viewBox="0 0 24 24" style={s}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>;
  return null;
};

/* == START: AI Deep Dive System Prompt ==
   3 sections: For Your Conditions, Timing & Absorption, Medication Interactions
   2-3 sentences each, condition-specific, no repeating base card content
   == END: AI Deep Dive System Prompt == */
const DEEP_DIVE_SYS = `You are NutriGuide, an evidence-based nutrition advisor for adults 50+ managing multiple chronic conditions. You generate personalized nutrient guidance using EXACTLY this three-section format:

**For Your Conditions**
2-3 sentences on why this nutrient matters for the user's specific condition combination. Reference interactions between conditions. Never repeat food sources, RDA, or food tips already shown in the base card.

**Timing & Absorption**
2-3 sentences on practical when/how guidance tailored to their conditions. Meal timing, food pairing, gradual introduction.

**Medication Interactions**
2-3 sentences on drug-nutrient interactions relevant to their conditions. Always end with "discuss with your provider" when clinically relevant.

Rules: Plain language. No bullet points. No markdown headers with #. Use **bold** only for the three section titles. Flowing sentences only. Never generic advice - always reference their specific conditions.`;

/* == START: Chat System Prompt ==
   Simple Qs: "Based on your conditions (list)," + 2-3 sentences
   Deeper Qs: conditions in opener + 3-4 bold foods with colon + Tip
   Always condition-aware, never contradict curated content
   == END: Chat System Prompt == */
const CHAT_SYS_BASE = `You are NutriGuide, an AI nutrition advisor for adults 50+ managing chronic conditions.

UNIVERSAL RULE: Every response starts with "Based on your conditions (list)".

FOR SIMPLE QUESTIONS (yes/no, quick facts, "can I...", "is it okay...", "how much..."):
- Start with "Based on your conditions (list), [direct answer]."
- 2-3 sentences total. Condition-aware but conversational.

FOR DEEPER QUESTIONS (food choices, meal strategies, "what should I eat", "food choices for", "help me with"):
- Start with "Based on your conditions (list all), [brief intro sentence about the topic]."
- Then "Here are some recommended [topic]."
- 3-4 recommendations with **bold name:** followed by 2 sentences explaining why it matters for their conditions
- End with "**Tip:** [one concrete actionable step tied to recommendations above]"
- Do NOT repeat the conditions list a second time. Only mention them once in the opening sentence.

RULES:
- Warm, concise tone
- Every recommendation tied to user's conditions
- Never contradict the curated nutrition content in the app
- Stay within nutrition scope - redirect medical/diagnostic questions
- No bullet points - use bold names with dash for recommendations
- When uncertain, default to "discuss with your provider"
- Keep responses concise - never exceed 200 words`;

/* == START: AI API Call Helper ==
   callAI(system, message, history) — calls Anthropic API
   buildCtx() — builds user context string for AI
   == END: AI API Call Helper == */
async function callAI(sys, msg, history) {
  try {
    const messages = history ? [...history, {role:"user",content:msg}] : [{role:"user",content:msg}];
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:sys,messages})
    });
    const d = await r.json();
    return d.content?.map(b=>b.text||"").join("\n")||"No response received.";
  } catch(e) { return "Error connecting to AI. Please try again."; }
}

function buildCtx(sc, sex, age, rn) {
  return `User: ${sex}, age ${age}. Conditions: ${sc.map(c=>c.name).join(", ")}. Key nutrients: ${rn.slice(0,8).map(n=>n.name).join(", ")}.`;
}

/* ───────── Sub-Components ───────── */
const Spinner = () => <div style={{display:"flex",alignItems:"center",gap:8,padding:"12px 0"}}><div style={{width:16,height:16,border:"2px solid #ccc",borderTopColor:"currentColor",borderRadius:"50%",animation:"spin .8s linear infinite"}}/><span style={{fontSize:".84rem",color:"#888"}}>Generating...</span></div>;

const NutrientCard = ({n, selConds, sex, age, isOpen, onToggle}) => {
  const rv=n.rda[sex]?.[age]||"";
  const rel=selConds.filter(c=>n.conditions.includes(c.id));
  const [dive,setDive]=useState(null);
  const [loading,setLoading]=useState(false);

  const doDive=async(e)=>{
    e.stopPropagation();
    if(dive){setDive(null);return;}
    setLoading(true);
    const ctx=`User: ${sex}, age ${age}. Conditions: ${selConds.map(c=>c.name).join(", ")}.`;
    const msg=`${ctx}\n\nDeep dive on ${n.name} for this user's conditions: ${rel.map(c=>c.name).join(", ")}. Follow the exact three-section format.`;
    const result=await callAI(DEEP_DIVE_SYS,msg);
    setDive(result);
    setLoading(false);
  };

  const renderDive=(text)=>{
    const parts=text.split(/\*\*([^*]+)\*\*/g);
    return parts.map((p,i)=>i%2===1?<strong key={i} style={{color:t.pri}}>{p}</strong>:<span key={i}>{p}</span>);
  };

  return (
    <div style={{background:"#fff",borderRadius:12,marginBottom:16,overflow:"hidden",boxShadow:"0 2px 6px rgba(0,0,0,.05)"}}>
      <div onClick={onToggle} style={{padding:"15px 18px",cursor:"pointer",display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:12}}>
        <div style={{flex:1}}>
          <div style={{fontSize:".96rem",fontWeight:600,color:"#333"}}>{n.name}</div>
          <div style={{fontSize:".84rem",color:"#555",marginTop:3,lineHeight:1.5}}>{n.simple}</div>
          <div style={{fontSize:".72rem",color:"#999",marginTop:6}}>Relevant to: {rel.map(c=>`${c.icon} ${c.name}`).join(" \u00B7 ")}</div>
        </div>
        <div style={{fontSize:".78rem",color:"#999",fontWeight:600,whiteSpace:"nowrap",flexShrink:0,marginTop:2}}>{isOpen?"Show less \u25B2":"Learn more \u25BC"}</div>
      </div>
      {isOpen&&(
        <div style={{padding:"0 18px 18px"}}>
          <div style={{padding:"16px 0 4px",borderTop:"1px solid #e8eeec"}}>
            <div style={{fontSize:".87rem",color:"#555",lineHeight:1.7,marginBottom:12}}>{n.detail}</div>
            <div style={{fontSize:".72rem",fontWeight:700,textTransform:"uppercase",letterSpacing:".07em",color:"#999",margin:"12px 0 6px"}}>Your Daily Target</div>
            <div style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid rgba(0,0,0,.05)",fontSize:".85rem"}}>
              <span style={{color:"#777"}}>{sex==="female"?"Women":"Men"}, {age}</span>
              <span style={{fontWeight:600,color:t.pri}}>{rv}</span>
            </div>
            <div style={{fontSize:".72rem",fontWeight:700,textTransform:"uppercase",letterSpacing:".07em",color:"#999",margin:"12px 0 6px"}}>Food Sources</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:10}}>
              {n.foods.map((f,i)=>(
                <div key={i} style={{background:"#f2f3f4",borderRadius:8,padding:"8px 12px",fontSize:".82rem",border:"none"}}>
                  <strong style={{display:"block",color:"#333",fontWeight:600}}>{f.n}</strong>
                  <span style={{color:"#777"}}>{f.s}: {f.v}</span>
                  {f.note&&<div style={{color:t.pri,fontSize:".77rem",fontWeight:600,marginTop:2}}>{f.note}</div>}
                </div>
              ))}
            </div>
            {n.foodAction&&<div style={{marginTop:16,fontSize:".84rem",color:"#555",fontWeight:500,lineHeight:1.55,paddingLeft:10,borderLeft:`3px solid ${t.pri}`,display:"inline-block"}}>{n.foodAction}</div>}
            <div style={{marginTop:16}}>
              <button onClick={doDive} style={{background:dive?t.hover:t.badge,color:t.badgeTxt,border:`1px solid ${t.mid}`,borderRadius:8,padding:"8px 16px",fontSize:".82rem",fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:6,transition:"all .15s"}}>
                <span style={{fontSize:".9rem"}}>{dive?"\u2715":"\u2728"}</span> {dive?"Close Deep Dive":"AI Deep Dive \u2014 Personalized for Your Conditions"}
              </button>
            </div>
            {loading&&<Spinner/>}
            {dive&&!loading&&(
              <div style={{marginTop:12,padding:16,background:`linear-gradient(135deg, ${t.lt}, #fff)`,borderRadius:10,border:`1px solid ${t.mid}`,fontSize:".86rem",color:"#444",lineHeight:1.75}}>
                <div style={{fontSize:".7rem",fontWeight:700,textTransform:"uppercase",letterSpacing:".08em",color:t.pri,marginBottom:8,display:"flex",alignItems:"center",gap:4}}>
                  {"\u2728"} AI-Generated Personalized Guidance
                </div>
                {dive.split("\n").filter(Boolean).map((p,i)=><p key={i} style={{marginBottom:8}}>{renderDive(p)}</p>)}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

/* == START: Chat Panel Component ==
   Slide-in panel, resets on open, suggestion buttons
   Renders bold text from AI responses
   == END: Chat Panel Component == */
const ChatPanel = ({isOpen,onClose,selConds,sex,age,relNutrients}) => {
  const [msgs,setMsgs]=useState([]);
  const [input,setInput]=useState("");
  const [loading,setLoading]=useState(false);
  const endRef=useRef(null);
  const inputRef=useRef(null);

  useEffect(()=>{endRef.current?.scrollIntoView({behavior:"smooth"});},[msgs,loading]);
  useEffect(()=>{if(isOpen){setMsgs([]);setInput("");inputRef.current?.focus();}},[isOpen]);

  const send=async()=>{
    if(!input.trim()||loading)return;
    const userMsg=input.trim();
    setInput("");
    setMsgs(prev=>[...prev,{role:"user",text:userMsg}]);
    setLoading(true);
    const ctx=buildCtx(selConds,sex,age,relNutrients);
    const sys=CHAT_SYS_BASE+`\n\n${ctx}`;
    const history=msgs.slice(-6).map(m=>({role:m.role==="user"?"user":"assistant",content:m.text}));
    const result=await callAI(sys,userMsg,history);
    setMsgs(prev=>[...prev,{role:"assistant",text:result}]);
    setLoading(false);
  };

  const renderMsg=(text)=>{
    const parts=text.split(/\*\*([^*]+)\*\*/g);
    return parts.map((p,i)=>i%2===1?<strong key={i}>{p}</strong>:<span key={i}>{p}</span>);
  };

  const suggestions=["What should I eat for breakfast?","Best anti-inflammatory foods for me?","Can I eat bananas?","How do my conditions interact nutritionally?"];

  if(!isOpen) return null;
  return (
    <>
      <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.35)",zIndex:499}}/>
      <div style={{position:"fixed",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:"min(420px, 92vw)",height:"min(620px, 80vh)",background:"#fff",borderRadius:16,boxShadow:"0 12px 40px rgba(0,0,0,.2)",zIndex:500,display:"flex",flexDirection:"column",overflow:"hidden",border:`1px solid ${t.mid}`}}>
        <div style={{padding:"14px 18px",background:t.lt,display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0,borderRadius:"16px 16px 0 0"}}>
          <div><div style={{fontWeight:700,fontSize:".92rem",color:t.pri}}>Ask NutriGuide</div><div style={{fontSize:".72rem",color:"#999"}}>{selConds.length} {"condition"}{selConds.length>1?"s":""} {"\u00B7"} Personalized AI Guidance</div></div>
          <button onClick={onClose} style={{background:"#fff",border:`1px solid ${t.mid}`,color:"#777",width:28,height:28,borderRadius:6,cursor:"pointer",fontSize:".85rem",display:"flex",alignItems:"center",justifyContent:"center"}}>{"\u2715"}</button>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:16}}>
          {msgs.length===0&&(
            <div>
              <p style={{fontSize:".85rem",color:"#777",marginBottom:12,lineHeight:1.6}}>{"Hi! I\u2019m your AI nutrition advisor, personalized for your conditions. Try asking:"}</p>
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                {suggestions.map((s,i)=><button key={i} onClick={()=>setInput(s)} style={{background:t.lt,border:"none",borderRadius:8,padding:"8px 12px",fontSize:".82rem",color:t.pri,cursor:"pointer",textAlign:"left",fontWeight:500}}>{s}</button>)}
              </div>
            </div>
          )}
          {msgs.map((m,i)=>(
            <div key={i} style={{marginBottom:12,display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start"}}>
              <div style={{maxWidth:"85%",padding:"10px 14px",borderRadius:m.role==="user"?"14px 14px 4px 14px":"14px 14px 14px 4px",background:m.role==="user"?t.badge:t.lt,color:m.role==="user"?t.dk:"#444",fontSize:".86rem",lineHeight:1.7}}>
                {m.text.split("\n").filter(Boolean).map((p,j)=><p key={j} style={{marginBottom:4}}>{renderMsg(p)}</p>)}
              </div>
            </div>
          ))}
          {loading&&<div style={{display:"flex",justifyContent:"flex-start",marginBottom:12}}><div style={{padding:"10px 14px",borderRadius:"14px 14px 14px 4px",background:t.lt}}><Spinner/></div></div>}
          <div ref={endRef}/>
        </div>
        <div style={{padding:"10px 14px",borderTop:"1px solid #e8eeec",display:"flex",gap:8,flexShrink:0,background:"#fff"}}>
          <input ref={inputRef} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")send()}} placeholder="Ask about nutrition..." style={{flex:1,padding:"10px 14px",border:"1px solid #ddd",borderRadius:10,fontSize:".88rem",outline:"none"}}/>
          <button onClick={send} disabled={!input.trim()||loading} style={{background:t.pri,color:"#fff",border:"none",borderRadius:10,padding:"0 18px",fontWeight:700,cursor:input.trim()&&!loading?"pointer":"not-allowed",opacity:input.trim()&&!loading?1:.5,fontSize:".88rem"}}>Send</button>
        </div>
      </div>
    </>
  );
};

/* == START: Settings Panel Component ==
   Contains profile editing (sex, age) and condition selection
   Replaces the old theme switcher
   == END: Settings Panel Component == */
const SettingsPanel = ({isOpen, onClose, sex, setSex, age, setAge, selected, toggleCond}) => {
  if(!isOpen) return null;
  return (
    <div style={{position:"fixed",inset:0,zIndex:600,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div onClick={onClose} style={{position:"absolute",inset:0,background:"rgba(0,0,0,.35)"}}/>
      <div style={{position:"relative",background:"#fff",borderRadius:16,width:"min(560px, 92vw)",maxHeight:"85vh",overflowY:"auto",boxShadow:"0 12px 40px rgba(0,0,0,.18)"}}>
        {/* Header */}
        <div style={{padding:"18px 24px",background:t.lt,borderBottom:"none",borderRadius:"16px 16px 0 0",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{fontSize:"1rem",fontWeight:600,color:t.pri}}>Settings</div>
          <button onClick={onClose} style={{width:30,height:30,borderRadius:8,background:"#fff",border:`1px solid ${t.mid}`,cursor:"pointer",fontSize:".85rem",color:"#777",display:"flex",alignItems:"center",justifyContent:"center"}}>{"\u2715"}</button>
        </div>

        <div style={{padding:"24px",background:"#F9FAFB"}}>
          {/* Profile section */}
          <div style={{background:"#fff",borderRadius:14,padding:"20px 22px",marginBottom:24,boxShadow:"0 2px 8px rgba(0,0,0,.04)"}}>
            <div style={{fontSize:".8rem",fontWeight:700,textTransform:"uppercase",letterSpacing:".07em",color:"#777",marginBottom:12}}>Your Profile</div>
            <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
              <div style={{flex:1,minWidth:140}}>
                <label style={{display:"block",fontSize:".78rem",fontWeight:600,color:"#777",textTransform:"uppercase",letterSpacing:".06em",marginBottom:6}}>Biological Sex</label>
                <select value={sex} onChange={e=>setSex(e.target.value)} style={{width:"100%",padding:"9px 12px",border:"1px solid #ddd",borderRadius:8,fontSize:".92rem",color:"#555",outline:"none",background:"#fff"}}>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                </select>
              </div>
              <div style={{flex:1,minWidth:140}}>
                <label style={{display:"block",fontSize:".78rem",fontWeight:600,color:"#777",textTransform:"uppercase",letterSpacing:".06em",marginBottom:6}}>Age Group</label>
                <select value={age} onChange={e=>setAge(e.target.value)} style={{width:"100%",padding:"9px 12px",border:"1px solid #ddd",borderRadius:8,fontSize:".92rem",color:"#555",outline:"none",background:"#fff"}}>
                  <option value="50-60">{"\u0035\u0030\u2013\u0036\u0030 years"}</option>
                  <option value="61-70">{"\u0036\u0031\u2013\u0037\u0030 years"}</option>
                  <option value="71+">71+ years</option>
                </select>
              </div>
            </div>
          </div>

          {/* Conditions section */}
          <div style={{background:"#fff",borderRadius:14,padding:"20px 22px",boxShadow:"0 2px 8px rgba(0,0,0,.04)"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:14}}>
              <div style={{fontSize:".8rem",fontWeight:700,textTransform:"uppercase",letterSpacing:".07em",color:"#777"}}>Health Concerns <span style={{fontWeight:400,textTransform:"none",letterSpacing:0,color:"#aaa"}}>(choose all that apply)</span></div>
              <div style={{fontSize:".82rem",color:"#999",flexShrink:0}}>Selected: <span style={{color:t.pri,fontWeight:700}}>{selected.size}</span></div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:10}}>
              {conditions.map(c=>{const isSel=selected.has(c.id);return(
                <div key={c.id} onClick={()=>toggleCond(c.id)} style={{background:isSel?t.lt:"#f8f9fa",border:isSel?`1px solid ${t.mid}`:"1px solid transparent",borderRadius:8,padding:"11px 13px",cursor:"pointer",display:"flex",alignItems:"center",gap:10,boxShadow:isSel?"0 1px 4px rgba(0,0,0,.08)":"0 1px 4px rgba(0,0,0,.06)",transition:"all .15s"}}>
                  <span style={{fontSize:"1.2rem",width:26,textAlign:"center",flexShrink:0}}>{c.icon}</span>
                  <div style={{flex:1,minWidth:0}}><div style={{fontSize:".85rem",fontWeight:500,color:"#333",lineHeight:1.3}}>{c.name}</div><div style={{fontSize:".72rem",color:"#999",marginTop:2}}>{catLabels[c.cat]}</div></div>
                </div>
              );})}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* == START: Main App ==
   No select screen — goes straight to guidance
   Nav: connections, nutrients, foods to limit, supplements
   Show/hide sections (no scroll observer)
   == END: Main App == */
const navSections=[{id:"connection",label:"Connections",labelLong:"How Conditions Are Linked"},{id:"nutrients",label:"Nutrients",labelLong:"Key Nutrients & Foods"},{id:"limit",label:"Limit",labelLong:"Foods to Limit"},{id:"supplements",label:"Supplements",labelLong:"Supplements"}];

export default function NutriGuide() {
  const [sex,setSex]=useState("female");
  const [age,setAge]=useState("50-60");
  const [selected,setSelected]=useState(new Set());
  const [settingsOpen,setSettingsOpen]=useState(false);
  const [activeNav,setActiveNav]=useState("connection");
  const [openNuts,setOpenNuts]=useState(new Set());
  const [pathOpen,setPathOpen]=useState(false);
  const [chatOpen,setChatOpen]=useState(false);
  const [hasOnboarded,setHasOnboarded]=useState(false);

  const toggleCond=(id)=>{
    setSelected(prev=>{
      const next=new Set(prev);
      if(next.has(id))next.delete(id);
      else{const exc=mutualExclusions[id];if(exc&&next.has(exc))next.delete(exc);next.add(id);}
      return next;
    });
  };

  const selConds=conditions.filter(c=>selected.has(c.id));
  const selIds=[...selected];
  const pc={};selConds.forEach(c=>c.pathways.forEach(p=>{pc[p]=(pc[p]||0)+1;}));
  const sharedP=Object.entries(pc).filter(([,v])=>v>1).map(([k])=>k);
  const relN=nutrients.filter(n=>n.conditions.some(c=>selIds.includes(c))).map(n=>({...n,mc:n.conditions.filter(c=>selIds.includes(c)).length})).sort((a,b)=>b.mc-a.mc);
  const essentials=relN.filter(n=>n.type==="nutrient");
  const bioactives=relN.filter(n=>n.type==="bioactive");
  const relF=foodsToLimit.filter(f=>f.conds.some(c=>selIds.includes(c)));
  const suppAll=relN.filter(n=>n.supp);

  /* ── ONBOARDING (first-time) ── */
  if(!hasOnboarded){
    return (
      <div style={{fontFamily:"'Segoe UI',system-ui,sans-serif",background:"#F9FAFB",minHeight:"100vh",color:"#555"}}>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <header style={{background:"#fff",borderBottom:"1px solid #e8eeec",padding:"14px 28px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100}}>
          <div style={{display:"flex",alignItems:"center",gap:7}}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{width:26,height:26,flexShrink:0}}>
              <circle cx="24" cy="24" r="21" fill="none" stroke="#2E7AD9" strokeWidth="3.5"/>
              <path d="M13 35 L19 19 L35 13 L29 29 Z" fill="#2E7AD9"/>
              <circle cx="24" cy="24" r="2.8" fill="#fff"/>
            </svg>
            <div>
              <div style={{fontSize:"1.1rem"}}><span style={{fontWeight:500,color:"#2E7AD9"}}>Nutri</span><span style={{fontWeight:300,color:"#2E7AD9"}}>Guide</span></div>
              <div style={{fontSize:".72rem",color:"#aaa",marginTop:1}}>Personalized Nutrition Guidance</div>
            </div>
          </div>
        </header>
        <div style={{padding:"32px 24px",maxWidth:940,margin:"0 auto"}}>
          <BackToGallery/>
          <div style={{fontSize:"1.5rem",fontWeight:400,color:"#666",marginBottom:4,marginTop:16}}>Welcome to NutriGuide</div>
          <div style={{color:"#777",fontSize:".92rem",marginBottom:28}}>Select your profile and health concerns to receive personalized, food-first nutrition guidance tailored to your conditions.</div>
          <div style={{background:"#fff",borderRadius:14,padding:"20px 22px",marginBottom:24,boxShadow:"0 2px 8px rgba(0,0,0,.04)"}}>
            <div style={{fontSize:".8rem",fontWeight:700,textTransform:"uppercase",letterSpacing:".07em",color:"#777",marginBottom:12}}>Your Profile</div>
            <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
              <div style={{flex:1,minWidth:140}}><label style={{display:"block",fontSize:".78rem",fontWeight:600,color:"#777",textTransform:"uppercase",letterSpacing:".06em",marginBottom:6}}>Biological Sex</label><select value={sex} onChange={e=>setSex(e.target.value)} style={{width:"100%",padding:"9px 12px",border:"1px solid #ddd",borderRadius:8,fontSize:".92rem",color:"#555",outline:"none",background:"#fff"}}><option value="female">Female</option><option value="male">Male</option></select></div>
              <div style={{flex:1,minWidth:140}}><label style={{display:"block",fontSize:".78rem",fontWeight:600,color:"#777",textTransform:"uppercase",letterSpacing:".06em",marginBottom:6}}>Age Group</label><select value={age} onChange={e=>setAge(e.target.value)} style={{width:"100%",padding:"9px 12px",border:"1px solid #ddd",borderRadius:8,fontSize:".92rem",color:"#555",outline:"none",background:"#fff"}}><option value="50-60">{"50\u201360 years"}</option><option value="61-70">{"61\u201370 years"}</option><option value="71+">71+ years</option></select></div>
            </div>
          </div>
          <div style={{background:"#fff",borderRadius:14,padding:"20px 22px",marginBottom:28,boxShadow:"0 2px 8px rgba(0,0,0,.04)"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:14}}>
              <div style={{fontSize:".8rem",fontWeight:700,textTransform:"uppercase",letterSpacing:".07em",color:"#777"}}>Select Your Health Concerns <span style={{fontWeight:400,textTransform:"none",letterSpacing:0,color:"#aaa"}}>(choose all that apply)</span></div>
              <div style={{fontSize:".82rem",color:"#999",flexShrink:0}}>Selected: <span style={{color:t.pri,fontWeight:700}}>{selected.size}</span></div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:10}}>
              {conditions.map(c=>{const isSel=selected.has(c.id);return(
                <div key={c.id} onClick={()=>toggleCond(c.id)} style={{background:isSel?t.lt:"#f8f9fa",border:isSel?`1px solid ${t.mid}`:"1px solid transparent",borderRadius:8,padding:"11px 13px",cursor:"pointer",display:"flex",alignItems:"center",gap:10,boxShadow:isSel?"0 1px 4px rgba(0,0,0,.08)":"0 1px 4px rgba(0,0,0,.06)",transition:"all .15s"}}>
                  <span style={{fontSize:"1.2rem",width:26,textAlign:"center",flexShrink:0}}>{c.icon}</span>
                  <div style={{flex:1,minWidth:0}}><div style={{fontSize:".85rem",fontWeight:500,color:"#333",lineHeight:1.3}}>{c.name}</div><div style={{fontSize:".72rem",color:"#999",marginTop:2}}>{catLabels[c.cat]}</div></div>
                </div>
              );})}
            </div>
          </div>
          <button disabled={!selected.size} onClick={()=>{setHasOnboarded(true);setActiveNav("connection");setOpenNuts(new Set());setPathOpen(false);setChatOpen(false);}} style={{background:selected.size?t.pri:t.mid,color:"#fff",border:"none",padding:"12px 32px",borderRadius:8,fontSize:".95rem",fontWeight:700,cursor:selected.size?"pointer":"not-allowed",opacity:selected.size?1:.6,transition:"background .15s"}}>{"View My Nutrition Guidance \u2192"}</button>
        </div>
      </div>
    );
  }

  /* ── GUIDANCE SCREEN ── */
  const SectionContent = ({id}) => {
    if(id==="connection") return (
      <>
        <div style={{fontSize:"1.05rem",fontWeight:600,color:t.pri,marginBottom:6,paddingBottom:8,display:"flex",alignItems:"center",gap:8}}><NavIcon type="connection" color={t.pri}/> How Your Conditions Are Linked</div>
        <p style={{fontSize:".88rem",color:"#777",marginBottom:16,lineHeight:1.65}}>Many chronic conditions share the same underlying biological processes. Understanding these connections explains why improving one area of your nutrition can benefit multiple conditions at once.</p>
        {selConds.map(c=>(
          <div key={c.id} style={{background:"#fff",borderRadius:12,padding:"18px 20px",marginBottom:16,boxShadow:"0 2px 6px rgba(0,0,0,.05)"}}>
            <h4 style={{fontSize:".9rem",fontWeight:600,color:"#333",marginBottom:7}}>{c.icon} {c.name}</h4>
            {c.connection.map((p,i)=><p key={i} style={{fontSize:".87rem",color:"#555",lineHeight:1.7,marginTop:i>0?14:0}}>{p}</p>)}
          </div>
        ))}
        {sharedP.length>0&&(
          <div style={{background:"#fff",borderRadius:12,marginBottom:16,overflow:"hidden",boxShadow:"0 2px 6px rgba(0,0,0,.05)"}}>
            <div onClick={()=>setPathOpen(!pathOpen)} style={{padding:"15px 20px",cursor:"pointer"}}>
              <div style={{fontSize:".96rem",fontWeight:700,color:"#333",display:"flex",alignItems:"center",gap:8}}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={t.pri} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><path d="M12 7v4M10 13l-3.5 4M14 13l3.5 4"/></svg>
                Shared Biological Pathways
              </div>
              <div style={{fontSize:".84rem",color:"#555",marginTop:3,lineHeight:1.5}}>Your conditions share key biological pathways. Improving them through nutrition benefits all your health concerns.</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:8}}>{sharedP.map(p=><span key={p} style={{background:t.badge,color:t.badgeTxt,borderRadius:20,padding:"4px 12px",fontSize:".78rem",fontWeight:600}}>{p}</span>)}</div>
              <div style={{textAlign:"right",marginTop:10}}><span style={{fontSize:".78rem",color:"#999",fontWeight:600}}>{pathOpen?"Show less \u25B2":"Learn more \u25BC"}</span></div>
            </div>
            {pathOpen&&(
              <div style={{padding:"16px 20px 4px",borderTop:"1px solid #e8eeec"}}>
                {sharedP.map(p=>pathwayDetails[p]?(
                  <div key={p} style={{marginBottom:14}}>
                    <p style={{fontSize:".86rem",color:"#555",lineHeight:1.7,marginBottom:4}}><strong>{p}:</strong> {pathwayDetails[p][0]}</p>
                    <p style={{fontSize:".86rem",color:"#555",lineHeight:1.7}}>{pathwayDetails[p][1]}</p>
                  </div>
                ):null)}
              </div>
            )}
          </div>
        )}
      </>
    );
    if(id==="nutrients") return (
      <>
        <div style={{fontSize:"1.05rem",fontWeight:600,color:t.pri,marginBottom:6,paddingBottom:8,display:"flex",alignItems:"center",gap:8}}><NavIcon type="nutrients" color={t.pri}/> Key Nutrients & Foods</div>
        <p style={{fontSize:".88rem",color:"#777",marginBottom:16,lineHeight:1.65}}>Listed by relevance to your conditions \u2014 most applicable first. Expand any item to see your personalized daily target and food sources. Profile: <strong>{sex==="female"?"Female":"Male"}, {age}</strong>.</p>
        {essentials.length>0&&<><div style={{fontSize:".78rem",fontWeight:700,textTransform:"uppercase",letterSpacing:".08em",color:t.pri,margin:"18px 0 8px"}}>Essential Nutrients</div>{essentials.map(n=><NutrientCard key={n.id} n={n} selConds={selConds} sex={sex} age={age} isOpen={openNuts.has(n.id)} onToggle={()=>{const x=new Set(openNuts);if(x.has(n.id))x.delete(n.id);else x.add(n.id);setOpenNuts(x);}}/>)}</>}
        {bioactives.length>0&&<><div style={{fontSize:".78rem",fontWeight:700,textTransform:"uppercase",letterSpacing:".08em",color:t.pri,margin:"18px 0 8px"}}>Bioactive Compounds</div>{bioactives.map(n=><NutrientCard key={n.id} n={n} selConds={selConds} sex={sex} age={age} isOpen={openNuts.has(n.id)} onToggle={()=>{const x=new Set(openNuts);if(x.has(n.id))x.delete(n.id);else x.add(n.id);setOpenNuts(x);}}/>)}</>}
      </>
    );
    if(id==="limit") return (
      <>
        <div style={{fontSize:"1.05rem",fontWeight:600,color:t.pri,marginBottom:6,paddingBottom:8,display:"flex",alignItems:"center",gap:8}}><NavIcon type="limit" color={t.pri}/> Foods to Limit</div>
        <p style={{fontSize:".88rem",color:"#777",marginBottom:16,lineHeight:1.65}}>Reducing these foods consistently may meaningfully support your selected conditions. They are not prohibited \u2014 frequency and portion size matter most.</p>
        {relF.length>0?(
          <div style={{background:"#fff",borderRadius:12,padding:"18px 20px",marginBottom:16,boxShadow:"0 2px 6px rgba(0,0,0,.05)"}}>
            {relF.map((f,i)=><div key={i} style={{display:"flex",gap:10,marginBottom:i<relF.length-1?10:0,fontSize:".87rem"}}><span style={{color:"#c0392b",fontWeight:700,flexShrink:0,marginTop:1}}>{"\u2192"}</span><div><strong style={{color:"#333",display:"block",marginBottom:2,fontWeight:500}}>{f.food}</strong><span style={{color:"#777"}}>{f.reason}</span></div></div>)}
          </div>
        ):<div style={{background:"#fff",borderRadius:12,padding:20,fontSize:".87rem",color:"#999",fontStyle:"italic",textAlign:"center",boxShadow:"0 2px 6px rgba(0,0,0,.05)"}}>No specific foods to limit identified.</div>}
      </>
    );
    if(id==="supplements") return (
      <>
        <div style={{fontSize:"1.05rem",fontWeight:600,color:t.pri,marginBottom:6,paddingBottom:8,display:"flex",alignItems:"center",gap:8}}><NavIcon type="supplements" color={t.pri}/> Supplements</div>
        <p style={{fontSize:".88rem",color:"#777",marginBottom:16,lineHeight:1.65}}>Presented for educational awareness only \u2014 not a recommendation. Food-first is always the foundation. Supplements may be considered when food sources are consistently insufficient.</p>
        {suppAll.length>0?(
          <>
            {suppAll.filter(n=>n.type==="nutrient").length>0&&<><div style={{fontSize:".78rem",fontWeight:700,textTransform:"uppercase",letterSpacing:".08em",color:t.pri,margin:"18px 0 8px"}}>Essential Nutrients</div>{suppAll.filter(n=>n.type==="nutrient").map(n=><div key={n.id} style={{background:"#fff",borderRadius:12,padding:"16px 18px",marginBottom:16,boxShadow:"0 2px 6px rgba(0,0,0,.05)"}}><h4 style={{fontSize:".9rem",fontWeight:600,color:"#333",marginBottom:6}}>{n.name}</h4><p style={{fontSize:".86rem",color:"#555",lineHeight:1.65}}>{n.supp}</p></div>)}</>}
            {suppAll.filter(n=>n.type==="bioactive").length>0&&<><div style={{fontSize:".78rem",fontWeight:700,textTransform:"uppercase",letterSpacing:".08em",color:t.pri,margin:"18px 0 8px"}}>Bioactive Compounds</div>{suppAll.filter(n=>n.type==="bioactive").map(n=><div key={n.id} style={{background:"#fff",borderRadius:12,padding:"16px 18px",marginBottom:16,boxShadow:"0 2px 6px rgba(0,0,0,.05)"}}><h4 style={{fontSize:".9rem",fontWeight:600,color:"#333",marginBottom:6}}>{n.name}</h4><p style={{fontSize:".86rem",color:"#555",lineHeight:1.65}}>{n.supp}</p></div>)}</>}
          </>
        ):<div style={{background:"#fff",borderRadius:12,padding:20,fontSize:".87rem",color:"#999",fontStyle:"italic",textAlign:"center",boxShadow:"0 2px 6px rgba(0,0,0,.05)"}}>Food sources generally sufficient.</div>}
        <div style={{background:"#fef4f4",borderRadius:12,padding:"16px 18px",marginTop:16,boxShadow:"0 2px 6px rgba(0,0,0,.05)"}}>
          <h4 style={{fontSize:".85rem",fontWeight:700,color:"#c0392b",marginBottom:6}}>{"\u2695\uFE0F"} Important Safety Note</h4>
          <p style={{fontSize:".83rem",color:"#7b241c",lineHeight:1.6}}>Supplements may interact with medications. Discuss with your provider before starting. This is educational, not medical advice.</p>
        </div>
      </>
    );
    return null;
  };

  const NavItems = () => (
    <>
      {navSections.map(s=>(
        <div key={s.id} onClick={()=>setActiveNav(s.id)} style={{display:"flex",alignItems:"center",gap:8,padding:"11px 16px",fontSize:".87rem",color:activeNav===s.id?t.pri:"#777",cursor:"pointer",fontWeight:activeNav===s.id?700:400,borderLeft:activeNav===s.id?`3px solid ${t.pri}`:"3px solid transparent",transition:"all .15s",background:"transparent"}}>
          <span style={{width:18,height:18,display:"flex",alignItems:"center",justifyContent:"center"}}><NavIcon type={s.id} color={activeNav===s.id?t.pri:"#666"}/></span>
          {s.labelLong}
        </div>
      ))}
    </>
  );

  return (
    <div style={{fontFamily:"'Segoe UI',system-ui,sans-serif",background:"#fff",minHeight:"100vh",color:"#555",paddingBottom:60}}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @media(max-width:768px){.ngNavD{display:none!important}.ngBottomBar{display:flex!important}}`}</style>

      {/* Header */}
      <header style={{background:"#fff",borderBottom:"1px solid #e8eeec",padding:"12px 20px",position:"sticky",top:0,zIndex:100}}>
        <div style={{display:"grid",gridTemplateColumns:"auto 1fr",gridTemplateRows:"auto auto",columnGap:16,rowGap:4}}>
          <div style={{gridRow:"1/3",display:"flex",alignItems:"flex-end"}}>
            <div style={{display:"flex",alignItems:"center",gap:7}}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{width:26,height:26,flexShrink:0}}>
                <circle cx="24" cy="24" r="21" fill="none" stroke="#2E7AD9" strokeWidth="3.5"/>
                <path d="M13 35 L19 19 L35 13 L29 29 Z" fill="#2E7AD9"/>
                <circle cx="24" cy="24" r="2.8" fill="#fff"/>
              </svg>
              <div>
                <div style={{fontSize:"1.1rem"}}><span style={{fontWeight:500,color:"#2E7AD9"}}>Nutri</span><span style={{fontWeight:300,color:"#2E7AD9"}}>Guide</span></div>
                <div style={{fontSize:".72rem",color:"#aaa",marginTop:1}}>Personalized Nutrition Guidance</div>
              </div>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"flex-end"}}>
            <button onClick={()=>setSettingsOpen(true)} style={{width:34,height:34,borderRadius:8,background:"transparent",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <svg viewBox="0 0 24 24" style={{width:20,height:20,stroke:t.pri,fill:"none",strokeWidth:1.8,strokeLinecap:"round",strokeLinejoin:"round"}}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            </button>
          </div>
          <div style={{display:"flex",justifyContent:"flex-end",alignItems:"center",paddingRight:8}}>
            <span onClick={()=>setChatOpen(true)} style={{display:"flex",alignItems:"center",gap:5,color:t.pri,fontSize:".8rem",fontWeight:600,cursor:"pointer"}}>
              <svg viewBox="0 0 24 24" style={{width:16,height:16,stroke:t.pri,fill:"none",strokeWidth:2}}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              Ask Expert
            </span>
          </div>
        </div>
      </header>

      <div style={{display:"flex",flex:1,minHeight:"calc(100vh - 57px)"}}>
        {/* Desktop sidebar nav */}
        <div className="ngNavD" style={{width:220,minWidth:220,background:"#fff",borderRight:"1px solid #e8eeec",padding:"12px 0",position:"sticky",top:57,alignSelf:"flex-start",height:"calc(100vh - 57px)",overflowY:"auto",display:"flex",flexDirection:"column"}}><div style={{padding:"0 16px 12px"}}><BackToGallery/></div><NavItems/></div>

        {/* Content — show only active section */}
        <div style={{flex:1,padding:28,minHeight:"calc(100vh - 57px)",background:t.contBg}}>
          {selected.size===0?(
            <div style={{textAlign:"center",padding:"60px 20px",color:"#999"}}>
              <div style={{fontSize:"2rem",marginBottom:12}}>{"\uD83C\uDF3F"}</div>
              <div style={{fontSize:"1.1rem",fontWeight:500,color:"#777",marginBottom:8}}>No conditions selected</div>
              <div style={{fontSize:".88rem",lineHeight:1.6,marginBottom:20}}>Open Settings to select your health concerns and see personalized nutrition guidance.</div>
              <button onClick={()=>setSettingsOpen(true)} style={{background:t.pri,color:"#fff",border:"none",padding:"10px 24px",borderRadius:8,fontSize:".9rem",fontWeight:600,cursor:"pointer"}}>Open Settings</button>
            </div>
          ):(
            <>
              <div style={{marginBottom:28}}>
                <div style={{fontSize:"1.5rem",fontWeight:400,color:"#666",marginBottom:4}}>Your Personalized Nutrition Guidance</div>
                <div style={{fontSize:".8rem",color:"#777",lineHeight:1.5,display:"flex",flexWrap:"wrap",alignItems:"baseline",gap:4}}>
                  <strong style={{color:"#555",fontWeight:500}}>{selConds.length} condition{selConds.length>1?"s":""} selected:</strong>
                  {selConds.map((c,i)=><span key={c.id} style={{fontSize:".78rem",color:"#777",whiteSpace:"nowrap"}}>{c.icon} {c.name}{i<selConds.length-1?" \u00B7":""}</span>)}
                </div>
              </div>
              <SectionContent id={activeNav}/>
            </>
          )}
        </div>
      </div>

      {/* Mobile bottom tab bar with labels */}
      <div className="ngBottomBar" style={{display:"none",position:"fixed",bottom:0,left:0,right:0,height:60,background:"#fff",borderTop:"1px solid #e8eeec",justifyContent:"space-around",alignItems:"center",zIndex:200,boxShadow:"0 -2px 8px rgba(0,0,0,.06)",paddingBottom:"env(safe-area-inset-bottom)"}}>
        {navSections.map(s=>(
          <button key={s.id} onClick={()=>setActiveNav(s.id)} style={{flex:1,height:56,border:"none",background:"transparent",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:3,transition:"all .15s",padding:0}} aria-label={s.labelLong}>
            <NavIcon type={s.id} color={activeNav===s.id?t.pri:"#999"}/>
            <span style={{fontSize:".62rem",fontWeight:activeNav===s.id?600:400,color:activeNav===s.id?t.pri:"#999",letterSpacing:".01em"}}>{s.label}</span>
          </button>
        ))}
      </div>

      {/* Settings modal */}
      <SettingsPanel isOpen={settingsOpen} onClose={()=>setSettingsOpen(false)} sex={sex} setSex={setSex} age={age} setAge={setAge} selected={selected} toggleCond={toggleCond}/>

      {/* Chat */}
      <ChatPanel isOpen={chatOpen} onClose={()=>setChatOpen(false)} selConds={selConds} sex={sex} age={age} relNutrients={relN}/>

    </div>
  );
}
