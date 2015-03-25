Test Scripts
============


### Suit Selector
1. Select the Player 1 circle to bring up the modal dialog.
2. Select each suit in the suit selector at the side.

Expected: The cards displayed should change to reflect the selected suit.


### Selected Cards 1
1. Select the Player 1 circle to bring up the modal dialog.
2. Select a suit from the suit selector.
3. Select a card from the card selector.

Expected: The selected cards should be greyed out in the card selector and should
be displayed at the bottom of the modal dialog with a red X in the top right of the card.
The second card slot should now appear blue to indicate a card can be placed here.


### Selected Cards 2
1. Select the Player 1 circle to bring up the modal dialog.
2. Select a suit from the suit selector.
3. Select a card from the card selector.
4. Repeat steps 2-3 for a second card.

Expected: The selected cards should be greyed out in the card selector and should
be displayed at the bottom of the modal dialog with a red X in the top right of the card.


### Do Not Save Selected Cards
1. Repeat the steps in **Selected Cards 2**
2. Click the close button.

Expected: The cards should not appear in the players hand on the table. P1 should still show a blue circle.
Clicking on the P1 circle should bring up the modal dialog box with the previous selection not present.


### Save Selected Cards
1. Repeat the steps in **Selected Cards 2**
2. Click the save button.

Expected: Cards should appear in the players hand on the table. Clicking on P1's hand should bring up the
modal dialog with the previous selection saved.


### Delete Selected Cards 1
1. Repeat the steps in **Selected Cards 1**
2. Click on the Red X to delete the card.

Expected: The card should be deleted from selected cards and should no longer be greyed out in the card selector.
The second card slot should go back to being disabled (black).


### Delete Selected Cards 2
1. Repeat the steps in **Selected Cards 2**
2. Click on the Red X for each card.

Expected: Both cards should be deleted and no longer greyed out in the card selector.
The first card slot should be blue (enabled) and the second black (disabled).


### Add Multiple Players
1. Select and save cards for P1.
2. Select and save cards for P2.

Expected: When selecting cards for P2, the cards previously selected for P1 should be greyed out and non selectable
in the modal dialog.


### Next Player Circle Turns Blue
1. Select and save cards for player n.
2. Select and save cards for player n+1.

Expected: The next player's circle (n+1) should turn from black to blue indicating it is now enabled.
