/* 500 verkefni, skipt á tíu stig. Eitt verkefni er valið af handahófi í hverri lotu. */

const words = (text) => text.trim().split(/\s+/);
const lines = (text) => text.trim().split("\n").map((line) => line.trim()).filter(Boolean);

const LEVELS = [
  {
    title: "Algeng orð",
    description: "100 algeng íslensk orð",
    color: "#147d7e",
    items: words(`
      að af allt alveg alltaf á áfram bara bæði bæta dag deila eða ef eiga eftir
      ekkert eina eins einnig einhver enn er fara fá fleiri frá fyrir gera geta
      gott hafa halda hann hér hún hvað hvar hvernig hjá hvort í inn já koma láta
      líka maður með meira mig mikið mjög muna mín niður nú ný og oft okkar orð
      rétt sama segja sér sjá síðan sinn sitja skal svo stór taka tíma tveir um
      upp úr út vera verða við vilja voru þú það þá þær þegar þetta því til baka
      aldrei aftur barn heim mest fólk
    `),
  },
  {
    title: "Auðveld orð",
    description: "70 stutt orð og íslenskir stafir",
    color: "#1a8d87",
    items: words(`
      api afi amma auga bíll bók bolti borð brauð brú dagur dós epli eyra fáni
      fiskur fótur gata glas græn gulur hattur hestur hjól hundur hús ís kaka kanna
      kisa kóngur kýr lampi lest ljón lóa mjólk mús nef nótt ostur pera poki rós
      rúm safi skip skóli skór snjór sól súpa taska tré úlpa vatn vinur ýsa ævi önd
      bangsi blóm bursti dreki fjall gluggi jakki kubbur lykill vasi
    `),
  },
  {
    title: "Tvö orð",
    description: "60 verkefni með bili",
    color: "#268f75",
    items: lines(`
      góður dagur
      stór hundur
      rautt hús
      kalt vatn
      lítil mús
      blár bíll
      gul sól
      grænt epli
      heit súpa
      ný bók
      gamall skóli
      hvítur snjór
      svartur köttur
      falleg rós
      stórt tré
      lítill fugl
      góður vinur
      hlýr jakki
      köld nótt
      mjúkt rúm
      langt skip
      hraður hestur
      sætt nammi
      ferskt brauð
      full kanna
      tóm taska
      blaut gata
      þung bók
      létt hjól
      sterkur vindur
      björt stjarna
      dökkt ský
      mjór stígur
      breið á
      hár turn
      lág girðing
      nýr lykill
      gamall bátur
      mjúk peysa
      þykk bók
      stutt saga
      fyndin mynd
      góður matur
      heitt kakó
      kaldur safi
      stór poki
      lítið glas
      hreint borð
      óhreinn bíll
      opinn gluggi
      lokuð hurð
      fallegt fjall
      langur dagur
      stutt nótt
      róleg tónlist
      hátt hljóð
      góður leikur
      einfalt dæmi
      rétt svar
      nýtt verkefni
    `),
  },
  {
    title: "Þrjú orð",
    description: "60 stutt orðasambönd",
    color: "#3a9270",
    items: lines(`
      ég á hund
      hún er góð
      þetta er hús
      hann drekkur vatn
      við förum út
      ég les bók
      þú átt bolta
      mamma bakar köku
      pabbi eldar mat
      barnið drekkur mjólk
      hundurinn eltir boltann
      kötturinn sefur inni
      sólin skín skært
      fuglinn flýgur hátt
      fiskurinn syndir hratt
      bíllinn er rauður
      taskan er þung
      eplið er grænt
      veðrið er gott
      klukkan er þrjú
      skólinn byrjar snemma
      vinurinn kemur heim
      ég finn lykil
      hún skrifar sögu
      hann sparkar bolta
      við borðum saman
      þau syngja lag
      þú lest vel
      ég get þetta
      allir fara heim
      amma prjónar peysu
      afi les blað
      Aron opnar gluggann
      Sara lokar hurðinni
      vindurinn blæs fast
      rigningin fellur niður
      snjórinn er hvítur
      blómið vex hratt
      strákurinn teiknar mynd
      stelpan finnur stein
      kennarinn hjálpar mér
      nemandinn svarar rétt
      rútan kemur núna
      klukkan hringir hátt
      maturinn er heitur
      safinn er kaldur
      ég klæði mig
      hún greiðir hárið
      hann burstar tennurnar
      við göngum heim
      þau hlaupa hratt
      hundurinn geltir hátt
      kötturinn mjálmar lágt
      fuglarnir syngja saman
      ég þvæ hendurnar
      þú opnar bókina
      við lærum íslensku
      þau spila fótbolta
      hann finnur svarið
      hún klárar verkefnið
    `),
  },
  {
    title: "Litlar setningar",
    description: "50 setningar með hástaf og punkti",
    color: "#57935f",
    items: lines(`
      Ég á rauðan bíl.
      Hundurinn er góður.
      Við förum í skólann.
      Kötturinn sefur inni.
      Hún les nýja bók.
      Hann drekkur kalt vatn.
      Sólin skín í dag.
      Fuglinn situr í trénu.
      Ég borða grænt epli.
      Vinur minn kemur heim.
      Amma bakar góða köku.
      Pabbi lagar gamla hjólið.
      Barnið leikur með boltann.
      Rútan kemur snemma í dag.
      Við syngjum skemmtilegt lag.
      Þau leika úti saman.
      Skórnir mínir eru blautir.
      Taskan liggur á borðinu.
      Ég finn litla lykilinn.
      Maturinn er tilbúinn núna.
      Snjórinn er mjúkur og hvítur.
      Blómið vex úti í garði.
      Kennarinn skrifar á töfluna.
      Við lærum ný orð.
      Ég get skrifað hratt.
      Afi les blaðið sitt.
      Amma prjónar hlýja peysu.
      Aron lokar stóra glugganum.
      Sara opnar rauðu bókina.
      Hundurinn eltir litla boltann.
      Kötturinn horfir út um gluggann.
      Fuglarnir syngja fallegt lag.
      Við borðum saman við borðið.
      Þau ganga hægt heim.
      Ég set bollann í vaskinn.
      Hún teiknar mynd af húsi.
      Hann finnur stein í fjörunni.
      Rigningin lemur á glugganum.
      Vindurinn hristir gömlu trén.
      Sólin hitar kalda jörðina.
      Ég klæði mig í úlpuna.
      Þú leggur bókina á borðið.
      Við bíðum eftir gulu rútunni.
      Þau hjálpa kennaranum í dag.
      Nemendurnir vinna verkefnið saman.
      Klukkan hangir uppi á vegg.
      Blái penninn liggur á gólfinu.
      Rauða ljósið blikkar hratt.
      Ég skrifa nafnið mitt hér.
      Allir klára verkefnið sitt.
    `),
  },
  {
    title: "Lengri setningar",
    description: "45 lengri setningar",
    color: "#718f54",
    items: lines(`
      Hundurinn minn hljóp hratt heim.
      Við fórum saman út að leika.
      Litli fuglinn sat uppi í tré.
      Ég setti bókina varlega í töskuna.
      Mamma bakaði köku fyrir afmælið mitt.
      Pabbi ók okkur snemma í skólann.
      Kötturinn svaf allan daginn í sófanum.
      Við sáum stórt skip úti á sjó.
      Krakkarnir léku sér saman í garðinum.
      Rigningin barði fast á gluggann minn.
      Ég fann fallegan stein niðri í fjöru.
      Sólin kom loksins fram undan skýjunum.
      Kennarinn las skemmtilega sögu fyrir okkur.
      Vinur minn kom með nýjan fótbolta.
      Við bjuggum til snjókarl fyrir utan húsið.
      Litla músin faldi sig undir borðinu.
      Ég klæddi mig vel áður en við fórum út.
      Gamli hundurinn gekk hægt niður götuna.
      Hún teiknaði stóra mynd af fjöllunum.
      Hann tók nestið sitt úr töskunni.
      Við hlustuðum á tónlist alla leiðina heim.
      Börnin hlógu þegar trúðurinn datt niður.
      Rauði bíllinn stöðvaði fyrir framan skólann.
      Ég lærði að skrifa nýtt orð í dag.
      Það var kalt en samt mjög fallegt veður.
      Afi sagði okkur fyndna sögu frá æsku sinni.
      Amma setti heitt kakó á eldhúsborðið.
      Við tókum rútuna heim eftir langan skóladag.
      Hann fann týnda vettlinginn undir bláa bekknum.
      Hún hjálpaði litla bróður sínum að klæða sig.
      Ég sá regnboga fyrir ofan háu fjöllin.
      Kötturinn stökk hratt yfir lágu girðinguna.
      Hundurinn beið rólegur fyrir utan litlu búðina.
      Við pökkuðum nesti áður en ferðin hófst.
      Kennarinn sýndi okkur hvernig dæmið var reiknað.
      Nemendurnir gengu hljóðlega inn á bókasafnið.
      Vindurinn feykti gulu laufunum yfir blauta götuna.
      Ég gleymdi regnhlífinni minni heima í morgun.
      Pabbi kveikti eld í litla arninum.
      Mamma las bók meðan við biðum eftir matnum.
      Þau byggðu stóran kastala úr mjúkum snjó.
      Rútubílstjórinn beið þar til allir voru sestir.
      Við sáum ref hlaupa yfir auða veginn.
      Hún skrifaði nafnið sitt efst á blaðið.
      Hann lokaði dyrunum varlega á eftir sér.
    `),
  },
  {
    title: "Greinarmerki",
    description: "35 spurningar, kommur og upphrópanir",
    color: "#8b894d",
    items: lines(`
      Hvað heitir þú?
      Komdu hingað!
      Má ég vera með?
      Já, það máttu!
      Hvar er taskan mín?
      Passaðu þig!
      Er maturinn tilbúinn?
      Nei, ekki alveg.
      Hvenær byrjar skólinn?
      Flýttu þér, rútan er að koma!
      Viltu epli, peru eða banana?
      Takk fyrir hjálpina!
      Af hverju ertu að hlæja?
      Bíddu aðeins, ég kem strax.
      Vá, þetta var flott!
      Eigum við að fara út?
      Já, veðrið er frábært!
      Hver á þennan bolta?
      Nú skulum við byrja.
      Hættu, boltinn er að koma!
      Getur þú opnað gluggann?
      Auðvitað, ekkert mál.
      Ertu tilbúinn í verkefnið?
      Frábært, þú fannst rétta svarið!
      Hvað gerðist þarna?
      Hvar, hvenær og hvernig gerðist þetta?
      Nei, ég finn ekki lykilinn minn.
      Já, við getum farið saman.
      Heyrðir þú þetta háa hljóð?
      Komið öll inn, tíminn er að byrja!
      Á ég að velja rautt eða blátt?
      Gott, þá er allt tilbúið.
      Hver vill lesa næstu setningu?
      Til hamingju, þú vannst leikinn!
      Æ, ég gleymdi bókinni heima!
    `),
  },
  {
    title: "Samtöl",
    description: "30 samtöl með íslenskum gæsalöppum",
    color: "#9b7d52",
    items: lines(`
      Jón sagði: „Komdu sæll!“
      Eva spurði: „Ertu tilbúinn?“
      Sara sagði: „Ég kem strax.“
      Aron spurði: „Hvar er boltinn?“
      Mamma kallaði: „Maturinn er tilbúinn!“
      Pabbi sagði: „Við förum eftir smástund.“
      Kennarinn spurði: „Hver veit svarið?“
      Anna svaraði: „Ég held að ég viti það.“
      Óli hrópaði: „Passaðu þig!“
      Embla sagði: „Þetta var mjög gaman.“
      Afi spurði: „Viltu heyra sögu?“
      Barnið svaraði: „Já, endilega!“
      Kári sagði: „Ég fann lykilinn.“
      Lóa spurði: „Má ég sjá hann?“
      Þór sagði: „Við skulum prófa aftur.“
      Edda kallaði: „Rútan er komin!“
      Benni spurði: „Eigum við að fara núna?“
      Una svaraði: „Já, ég er tilbúin.“
      Nói sagði: „Hundurinn minn heitir Max.“
      Íris spurði: „Er hann góður hundur?“
      Sara hvíslaði: „Ég heyrði eitthvað úti.“
      Aron svaraði: „Þetta var bara vindurinn.“
      Amma sagði: „Munið að klæða ykkur vel.“
      Afi kallaði: „Báturinn er tilbúinn!“
      Kennarinn sagði: „Opnið bækurnar á síðu tíu.“
      Nemandinn spurði: „Má ég fá aðstoð?“
      Mamma sagði: „Við sjáumst eftir skólann.“
      Pabbi spurði: „Ertu búinn með nestið?“
      Lóa hrópaði: „Ég vann leikinn!“
      Kári svaraði: „Til hamingju með það!“
    `),
  },
  {
    title: "Nokkrar setningar",
    description: "25 verkefni með tveimur setningum",
    color: "#8a6c77",
    items: lines(`
      Sólin skein. Við fórum út að leika.
      Það rigndi í morgun. Nú er komið sólskin.
      Ég fann gamlan bolta. Hann var undir rúminu.
      Hundurinn gelti hátt. Einhver var við dyrnar.
      Klukkan hringdi. Allir gengu inn í stofuna.
      Maturinn var tilbúinn. Við settumst við borðið.
      Bíllinn var óhreinn. Pabbi fór með hann í þvott.
      Hún opnaði bókina. Fyrsta sagan var um dreka.
      Ég leit út um gluggann. Stór fugl sat á girðingunni.
      Við fórum niður í fjöru. Þar fundum við fallegar skeljar.
      Snjórinn féll alla nóttina. Um morguninn var allt hvítt.
      Aron týndi lyklinum. Sem betur fer fann Sara hann.
      Kötturinn stökk upp á borðið. Glasið datt næstum niður.
      Ég kláraði verkefnið. Kennarinn sagði að það væri vel gert.
      Rútan kom of seint. Við biðum úti í tíu mínútur.
      Amma kom í heimsókn. Hún færði okkur nýbakað brauð.
      Vindurinn var sterkur. Trén sveifluðust fram og til baka.
      Síminn minn hringdi. Það var vinur minn að bjóða mér út.
      Við kveiktum á vasaljósinu. Hellirinn var dimmur og kaldur.
      Leikurinn var jafn. Síðasta markið réð úrslitunum.
      Ég gleymdi nestinu heima. Vinur minn deildi sínu með mér.
      Litli fuglinn datt úr hreiðrinu. Við hjálpuðum honum aftur upp.
      Það heyrðist hávær þruma. Skömmu síðar byrjaði að rigna.
      Við fundum gamalt kort. Á því var merkt lítil eyja.
      Rafmagnið fór af húsinu. Við kveiktum á nokkrum kertum.
    `),
  },
  {
    title: "Stuttur texti",
    description: "25 litlar frásagnir",
    color: "#6d76c8",
    items: lines(`
      Aron fann litla kistu úti í garði. Hann opnaði hana varlega og sá gamalt kort.
      Klukkan hringdi snemma. Sara stökk á fætur, klæddi sig og hljóp út í sólina.
      Lóa heyrði skrýtið hljóð frá geymslunni. Þar inni fann hún lítinn kettling í pappakassa.
      Við lögðum af stað áður en sólin kom upp. Ferðin var löng en útsýnið var frábært.
      Nói gleymdi nestinu sínu heima. Vinur hans gaf honum helminginn af samlokunni sinni.
      Snjórinn hafði lokað götunni. Nágrannarnir komu allir út og hjálpuðust að við að moka.
      Embla sá glitta í eitthvað undir trénu. Þetta var rauður pakki með nafninu hennar á.
      Gamli báturinn ruggaði rólega við bryggjuna. Afi losaði landfestina og kveikti á vélinni.
      Hundurinn hljóp skyndilega inn í skóginn. Við fylgdum slóðinni og fundum hann við lítinn læk.
      Rafmagnið fór af húsinu um kvöldið. Við kveiktum á kertum og spiluðum saman við eldhúsborðið.
      Íris æfði sig á hjólinu á hverjum degi. Loksins gat hún hjólað alla götuna án hjálpar.
      Kári opnaði hurðina að gömlu skemmunni. Inni var rykugt reiðhjól sem hann ákvað að gera upp.
      Við heyrðum þrumu í fjarska. Fljótlega hellirigndi og allir hlupu inn í hlýjuna.
      Kennarinn kom með lokaðan kassa í tímann. Þegar hann opnaði hann flaug lítið fiðrildi út.
      Sara fann veski á gangstéttinni. Hún fór með það á lögreglustöðina og eigandinn fékk það aftur.
      Morguninn var kaldur og dimmur. Þegar við komum út sáum við norðurljós dansa á himninum.
      Litla systir mín týndi bangsanum sínum. Eftir langa leit fannst hann undir sætinu í bílnum.
      Við bökuðum brauð í skólanum. Ilmurinn fyllti stofuna og allir fengu sneið að smakka.
      Nói sá eitthvað hreyfast í grasinu. Lítill broddgöltur gekk rólega yfir stíginn.
      Rútan festist í snjónum á leiðinni heim. Bílstjórinn mokaði frá hjólunum og við komumst áfram.
      Hundurinn kom inn með blauta fætur. Hann skildi eftir sig spor alla leið yfir gólfið.
      Ég fékk nýtt púsluspil í afmælisgjöf. Við fjölskyldan kláruðum það saman um kvöldið.
      Gamla klukkan á veggnum hafði stöðvast. Afi opnaði hana og skipti um litla rafhlöðu.
      Við fórum út með vasaljós eftir kvöldmat. Í myrkrinu fundum við þrjá litla froska.
      Hún setti síðasta kubbinn efst á turninn. Turninn stóð í smástund en féll síðan niður.
    `),
  },
];

window.RITFIMI_LEVELS = LEVELS;
