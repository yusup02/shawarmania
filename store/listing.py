# Google Play store listing texts for every language.
# Run `python3 store/listing.py` to check Play's length limits and regenerate store/listing.md.
import os

L = {}
L['en-US'] = dict(
title='Shawarmania: Idle Food Tycoon',
short='Wrap shawarma, upgrade your menu and grow a tiny kiosk into a food empire!',
full='''Open a tiny shawarma kiosk by the metro and grow it into a world-famous chain!

Shawarmania is a cozy idle tycoon about the best street food in the world. Tap the counter to wrap shawarma, upgrade your menu and watch customers line up for more, even while you're away.

★ FROM A KIOSK TO AN EMPIRE
Start at a metro kiosk, then move to a park food truck, a mall food court, a train station, a night market, a seaside café, a stadium and the airport. Every shop has its own menu, street view and tasks.

★ UPGRADE YOUR MENU
Unlock fries, drinks, cheesy wraps and the golden shawarma. Every customer buys the whole menu, so each new item boosts your income. Reach milestone levels to double prices.

★ VIP ORDERS
VIP guests ask for special orders. Pick the right ingredients before time runs out to earn big tips and chef cards.

★ COLLECT CHEFS
Granny Zina, Uncle Ashot, Chef Marco and friends. Level them up to get bonuses at every shop.

★ FRANCHISE STARS
Finish shop tasks to earn stars and spend them on permanent upgrades: a secret recipe, word of mouth, a bigger fridge for longer offline income and more.

★ DAILY GIFTS AND TASKS
Come back every day for a growing gift streak, three fresh tasks and a daily chest.

★ PLAY ANYWHERE
Works offline, saves automatically, no sign-up needed. Available in English, Русский, Español, Português, Deutsch, Français and Türkçe.

Found a bug or have an idea? Write to us, we read every message.''')

L['ru-RU'] = dict(
title='Шаурмания: тайкун шаурмечной',
short='Крути шаурму, улучшай меню и преврати маленький ларёк в империю!',
full='''Открой маленький ларёк с шаурмой у метро и преврати его в знаменитую сеть!

«Шаурмания» — уютный idle-тайкун про лучшую уличную еду. Жми на прилавок, чтобы заворачивать шаурму, улучшай меню и смотри, как растут очереди, даже когда ты не в игре.

★ ОТ ЛАРЬКА ДО ИМПЕРИИ
Начни у метро, а потом переезжай в фудтрак в парке, на фудкорт, вокзал, ночной рынок, в кафе на набережной, на стадион и в аэропорт. У каждой точки своё меню, своя улица за окном и свои задания.

★ УЛУЧШАЙ МЕНЮ
Открывай картошку фри, напитки, шаурму с сыром и золотую шаурму. Каждый клиент покупает всё меню, поэтому каждая новая позиция увеличивает доход. На ключевых уровнях цена удваивается.

★ VIP-ЗАКАЗЫ
VIP-гости приходят с особыми заказами. Собери нужные ингредиенты, пока не вышло время, и получи щедрые чаевые и карточки шефов.

★ СОБЕРИ КОМАНДУ ШЕФОВ
Бабуля Зина, Дядя Ашот, Шеф Марко и другие. Повышай их уровень и получай бонусы на всех точках.

★ ЗВЁЗДЫ ФРАНШИЗЫ
Выполняй задания точки, получай звёзды и трать их на постоянные улучшения: фирменный рецепт, сарафанное радио, большой холодильник для долгого офлайн-дохода и не только.

★ ПОДАРКИ И ЗАДАНИЯ КАЖДЫЙ ДЕНЬ
Заходи каждый день: подарки растут, а ещё тебя ждут три новых задания и сундук дня.

★ ИГРАЙ ГДЕ УГОДНО
Работает без интернета, сохраняется автоматически, без регистрации. Языки: русский, English, Español, Português, Deutsch, Français, Türkçe.

Нашёл ошибку или есть идея? Напиши нам, мы читаем каждое сообщение.''')

L['es-419'] = dict(
title='Shawarmania: Tycoon de comida',
short='¡Prepara shawarmas, mejora tu menú y convierte un quiosco en un imperio!',
full='''¡Abre un pequeño quiosco de shawarma junto al metro y conviértelo en una cadena famosa en todo el mundo!

Shawarmania es un tycoon idle relajante sobre la mejor comida callejera. Toca el mostrador para preparar shawarmas, mejora tu menú y mira cómo crecen las colas, incluso cuando no estás jugando.

★ DE UN QUIOSCO A UN IMPERIO
Empieza junto al metro y luego múdate a un food truck en el parque, al patio de comidas, a la estación de tren, al mercado nocturno, a un café junto al mar, al estadio y al aeropuerto. Cada local tiene su menú, su calle y sus tareas.

★ MEJORA TU MENÚ
Desbloquea papas fritas, bebidas, shawarma con queso y el shawarma de oro. Cada cliente compra todo el menú, así que cada producto nuevo aumenta tus ingresos. En los niveles clave el precio se duplica.

★ PEDIDOS VIP
Los clientes VIP piden pedidos especiales. Elige los ingredientes correctos antes de que se acabe el tiempo y gana grandes propinas y cartas de chef.

★ COLECCIONA CHEFS
La abuela Zina, el tío Ashot, el chef Marco y más. Súbelos de nivel para obtener bonos en todos los locales.

★ ESTRELLAS DE FRANQUICIA
Completa las tareas de cada local, gana estrellas y úsalas en mejoras permanentes: receta secreta, boca a boca, una nevera grande para ganar más tiempo sin conexión y mucho más.

★ REGALOS Y TAREAS DIARIAS
Vuelve cada día: los regalos crecen y te esperan tres tareas nuevas y un cofre diario.

★ JUEGA DONDE QUIERAS
Funciona sin conexión, guarda automáticamente y no necesita registro. Idiomas: Español, English, Русский, Português, Deutsch, Français y Türkçe.

¿Encontraste un error o tienes una idea? Escríbenos, leemos todos los mensajes.''')

L['pt-BR'] = dict(
title='Shawarmania: Tycoon de comida',
short='Prepare shawarmas, melhore o cardápio e transforme um quiosque num império!',
full='''Abra um pequeno quiosque de shawarma perto do metrô e transforme-o numa rede famosa no mundo todo!

Shawarmania é um tycoon idle aconchegante sobre a melhor comida de rua. Toque no balcão para preparar shawarmas, melhore o cardápio e veja as filas crescerem, mesmo quando você não está jogando.

★ DE QUIOSQUE A IMPÉRIO
Comece perto do metrô e depois mude para um food truck no parque, a praça de alimentação, a estação de trem, a feira noturna, um café na orla, o estádio e o aeroporto. Cada loja tem seu cardápio, sua rua e suas tarefas.

★ MELHORE O CARDÁPIO
Libere batata frita, bebidas, shawarma com queijo e o shawarma de ouro. Cada cliente compra o cardápio inteiro, então cada item novo aumenta sua renda. Nos níveis principais o preço dobra.

★ PEDIDOS VIP
Clientes VIP fazem pedidos especiais. Escolha os ingredientes certos antes que o tempo acabe e ganhe gorjetas generosas e cartas de chef.

★ COLECIONE CHEFS
Vovó Zina, Tio Ashot, Chef Marco e outros. Suba o nível deles para ganhar bônus em todas as lojas.

★ ESTRELAS DA FRANQUIA
Conclua as tarefas de cada loja, ganhe estrelas e use-as em melhorias permanentes: receita secreta, boca a boca, uma geladeira grande para render mais tempo offline e muito mais.

★ PRESENTES E TAREFAS DIÁRIAS
Volte todo dia: os presentes aumentam e você ganha três tarefas novas e um baú diário.

★ JOGUE ONDE QUISER
Funciona offline, salva automaticamente e não precisa de cadastro. Idiomas: Português, English, Русский, Español, Deutsch, Français e Türkçe.

Encontrou um erro ou tem uma ideia? Escreva para nós, lemos todas as mensagens.''')

L['de-DE'] = dict(
title='Shawarmania: Imbiss-Tycoon',
short='Wickle Shawarma, verbessere dein Menü und mach aus einem Kiosk ein Imperium!',
full='''Eröffne einen kleinen Shawarma-Kiosk an der U-Bahn und mach daraus eine weltberühmte Kette!

Shawarmania ist ein gemütliches Idle-Tycoon-Spiel über das beste Streetfood der Welt. Tippe auf die Theke, um Shawarma zu wickeln, verbessere dein Menü und sieh zu, wie die Schlangen wachsen, auch wenn du gerade nicht spielst.

★ VOM KIOSK ZUM IMPERIUM
Starte an der U-Bahn und zieh dann in einen Foodtruck im Park, in den Food Court, an den Bahnhof, auf den Nachtmarkt, in ein Café an der Promenade, ins Stadion und an den Flughafen. Jeder Laden hat sein eigenes Menü, seine eigene Straße und eigene Aufgaben.

★ VERBESSERE DEIN MENÜ
Schalte Pommes, Getränke, Käse-Shawarma und den goldenen Shawarma frei. Jeder Kunde kauft das ganze Menü, also steigert jedes neue Gericht deine Einnahmen. Auf wichtigen Stufen verdoppelt sich der Preis.

★ VIP-BESTELLUNGEN
VIP-Gäste wünschen sich besondere Bestellungen. Wähle die richtigen Zutaten, bevor die Zeit abläuft, und verdiene großes Trinkgeld und Kochkarten.

★ SAMMLE KÖCHE
Oma Zina, Onkel Ashot, Küchenchef Marco und mehr. Bring sie auf höhere Stufen und erhalte Boni in jedem Laden.

★ FRANCHISE-STERNE
Erledige die Aufgaben jedes Ladens, sammle Sterne und investiere sie in dauerhafte Verbesserungen: Geheimrezept, Mundpropaganda, einen großen Kühlschrank für längere Offline-Einnahmen und mehr.

★ TÄGLICHE GESCHENKE UND AUFGABEN
Komm jeden Tag wieder: Die Geschenke werden größer, und es warten drei neue Aufgaben und eine Tagestruhe.

★ SPIEL ÜBERALL
Funktioniert offline, speichert automatisch, keine Anmeldung nötig. Sprachen: Deutsch, English, Русский, Español, Português, Français und Türkçe.

Fehler gefunden oder eine Idee? Schreib uns, wir lesen jede Nachricht.''')

L['fr-FR'] = dict(
title='Shawarmania : Tycoon du snack',
short='Roule des shawarmas, améliore ton menu et fais d’un kiosque un empire !',
full='''Ouvre un petit kiosque à shawarma près du métro et transforme-le en chaîne connue dans le monde entier !

Shawarmania est un jeu de gestion idle tout doux sur la meilleure street food du monde. Touche le comptoir pour rouler des shawarmas, améliore ton menu et regarde les files s’allonger, même quand tu ne joues pas.

★ DU KIOSQUE À L’EMPIRE
Commence près du métro, puis déménage dans un food truck au parc, au food court, à la gare, au marché de nuit, dans un café en bord de mer, au stade et à l’aéroport. Chaque boutique a son menu, sa rue et ses missions.

★ AMÉLIORE TON MENU
Débloque les frites, les boissons, le shawarma au fromage et le shawarma doré. Chaque client achète tout le menu : chaque nouveau plat augmente tes revenus. Aux niveaux clés, le prix double.

★ COMMANDES VIP
Les clients VIP passent des commandes spéciales. Choisis les bons ingrédients avant la fin du temps et gagne de gros pourboires et des cartes de chef.

★ COLLECTIONNE LES CHEFS
Mamie Zina, Oncle Ashot, Chef Marco et bien d’autres. Fais-les monter de niveau pour obtenir des bonus dans toutes tes boutiques.

★ ÉTOILES DE FRANCHISE
Termine les missions de chaque boutique, gagne des étoiles et dépense-les en améliorations permanentes : recette secrète, bouche-à-oreille, grand frigo pour gagner plus longtemps hors ligne et plus encore.

★ CADEAUX ET MISSIONS DU JOUR
Reviens chaque jour : les cadeaux grandissent et trois nouvelles missions et un coffre du jour t’attendent.

★ JOUE PARTOUT
Fonctionne hors ligne, sauvegarde automatique, sans inscription. Langues : Français, English, Русский, Español, Português, Deutsch et Türkçe.

Un bug ou une idée ? Écris-nous, nous lisons tous les messages.''')

L['tr-TR'] = dict(
title='Shawarmania: Büfe Patronu',
short='Şavurma sar, menünü geliştir ve küçük bir büfeyi imparatorluğa dönüştür!',
full='''Metronun yanında küçük bir şavurma büfesi aç ve onu dünyaca ünlü bir zincire dönüştür!

Shawarmania, dünyanın en iyi sokak lezzeti hakkında keyifli bir idle tycoon oyunudur. Şavurma sarmak için tezgâha dokun, menünü geliştir ve oyunda olmadığın zamanlarda bile kuyrukların büyümesini izle.

★ BÜFEDEN İMPARATORLUĞA
Metronun yanında başla, sonra parktaki yemek kamyonuna, yemek katına, tren garına, gece pazarına, sahil kafesine, stadyuma ve havalimanına taşın. Her dükkânın kendi menüsü, sokağı ve görevleri var.

★ MENÜNÜ GELİŞTİR
Patates kızartması, içecekler, peynirli şavurma ve altın şavurmanın kilidini aç. Her müşteri tüm menüyü alır, yani her yeni ürün gelirini artırır. Önemli seviyelerde fiyat ikiye katlanır.

★ VIP SİPARİŞLER
VIP müşteriler özel siparişler verir. Süre bitmeden doğru malzemeleri seç, cömert bahşişler ve şef kartları kazan.

★ ŞEF TOPLA
Zina Nine, Ashot Amca, Şef Marco ve daha fazlası. Seviyelerini yükselt, her dükkânda bonus kazan.

★ FRANCHISE YILDIZLARI
Dükkân görevlerini tamamla, yıldız kazan ve bunları kalıcı geliştirmelere harca: gizli tarif, kulaktan kulağa, daha uzun çevrimdışı gelir için büyük buzdolabı ve daha fazlası.

★ GÜNLÜK HEDİYELER VE GÖREVLER
Her gün gel: hediyeler büyür, seni üç yeni görev ve günün sandığı bekler.

★ HER YERDE OYNA
İnternetsiz çalışır, otomatik kaydeder, kayıt gerekmez. Diller: Türkçe, English, Русский, Español, Português, Deutsch ve Français.

Bir hata mı buldun ya da bir fikrin mi var? Bize yaz, her mesajı okuyoruz.''')

LIMITS = {'title': 30, 'short': 80, 'full': 4000}
NAMES = {'en-US':'English (United States) — основной язык', 'ru-RU':'Русский', 'es-419':'Español (Latinoamérica)', 'pt-BR':'Português (Brasil)',
         'de-DE':'Deutsch', 'fr-FR':'Français (France)', 'tr-TR':'Türkçe'}

if __name__ == '__main__':
    bad = []
    for code, d in L.items():
        for k, lim in LIMITS.items():
            n = len(d[k])
            if n > lim: bad.append(f'{code} {k}: {n} > {lim}')
    if bad:
        raise SystemExit('Too long:\n' + '\n'.join(bad))
    out = ['# Shawarmania — тексты для Google Play', '',
           'Лимиты Google Play: название до 30 символов, краткое описание до 80, полное до 4000.',
           'Основной язык страницы — English (United States). Остальные добавляются как переводы.', '']
    for code, d in L.items():
        out += [f'## {NAMES[code]} · `{code}`', '',
                f'**Название** ({len(d["title"])}/30)', '', '```', d['title'], '```', '',
                f'**Краткое описание** ({len(d["short"])}/80)', '', '```', d['short'], '```', '',
                f'**Полное описание** ({len(d["full"])}/4000)', '', '```', d['full'], '```', '']
    open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'listing.md'), 'w').write('\n'.join(out))
    for code, d in L.items(): print(code, len(d['title']), len(d['short']), len(d['full']))
