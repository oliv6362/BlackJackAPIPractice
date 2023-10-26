# BlackJackAPIPractice
Dette projekt er udviklet med html, css og javascript, samt anvender en json API

Knapperne bruges således:
- New game: Hvis du gerne vil spille igen efter at have vundet, tabt osv
- Hit: Her tager du og derefter botten et kort fra bunken af kort
- Stay: Her vælger du, at du ikke vil have flere kort og er færdig

Relger for blackjack:
- Det gælder at få mere end modstanderen, men ikke højere end 21
- Hvis man rammer mere end 21, så er det bust og man har tabt
- hvis begge taber eller har det samme tal så er det draw
- Billed kort gælder for 10 og ace for 11 (normalt gælder ace også for 11 og 1, men fik ikke lige lavet det med 1 også)

Andet:
- Hvis du får bust og botten ikke har valgt Stay eller blevet bust selv, så vil den tage kort indtil den vælger at stay eller blevet bust
- Hvis du vælger stay og botten ikke har gjort det, så vil den også blive ved med at tage kort ligesom der blev forklaret før

IMPORTANT: Hvis du har node og npm installeret, så kan du kører projektet ved brug af "npx serve" i visual code terminal
