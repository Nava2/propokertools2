Test Scripts
============


### Poker Board on Start
1. Player circles should be blue.
2. Flop placeholders should be blue.
3. Turn and river placeholders should be black.
4. No cards present on the table.


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


### Simulation 1
1. Run the following simulation.
    a. P1:
    b. P2:
    c. Flop:
    d. Turn:
    e. River:

Expected:
    Winner:
    P1 Percentage:
    P1 Color:
    P2 Percentage:
    P2 Color:

Expected Output:
    Table:
    P1 Hand:
    P1 Equity:
    P1 Wins:
    P1 Ties:
    P2 Hand:
    P2 Equity:
    P2 Wins:
    P2 Ties:


### Simulation 2
1. Run the following simulation.
    a. P1:
    b. P2:
    c. P3:
    d. Flop:
    e. Turn:
    f. River:

Expected:
    Winner:
    P1 Percentage:
    P1 Color:
    P2 Percentage:
    P2 Color:
    P3 Percentage:
    P3 Color:

Expected Output:
    Table:
    P1 Hand:
    P1 Equity:
    P1 Wins:
    P1 Ties:
    P2 Hand:
    P2 Equity:
    P2 Wins:
    P2 Ties:
    P3 Hand:
    P3 Equity:
    P3 Wins:
    P3 Ties:


### Simulation 3
1. Run the following simulation.
    a. P1:
    b. P2:
    c. P3:
    d. P4:
    e. Flop:
    f. Turn:
    g. River:

Expected:
    Winner:
    P1 Percentage:
    P1 Color:
    P2 Percentage:
    P2 Color:
    P3 Percentage:
    P3 Color:
    P4 Percentage:
    P4 Color:

Expected Output:
    Table:
    P1 Hand:
    P1 Equity:
    P1 Wins:
    P1 Ties:
    P2 Hand:
    P2 Equity:
    P2 Wins:
    P2 Ties:
    P3 Hand:
    P3 Equity:
    P3 Wins:
    P3 Ties:
    P4 Hand:
    P4 Equity:
    P4 Wins:
    P4 Ties:


### Simulation 4
1. Run the following simulation.
    a. P1:
    b. P2:
    c. P3:
    d. P4:
    e. P5:
    f. Flop:
    g. Turn:
    h. River:

Expected:
    Winner:
    P1 Percentage:
    P1 Color:
    P2 Percentage:
    P2 Color:
    P3 Percentage:
    P3 Color:
    P4 Percentage:
    P4 Color:
    P5 Percentage:
    P5 Color:

Expected Output:
    Table:
    P1 Hand:
    P1 Equity:
    P1 Wins:
    P1 Ties:
    P2 Hand:
    P2 Equity:
    P2 Wins:
    P2 Ties:
    P3 Hand:
    P3 Equity:
    P3 Wins:
    P3 Ties:
    P4 Hand:
    P4 Equity:
    P4 Wins:
    P4 Ties:
    P5 Hand:
    P5 Equity:
    P5 Wins:
    P5 Ties:


### Simulation 5
1. Run the following simulation.
    a. P1:
    b. P2:
    c. P3:
    d. P4:
    e. P5:
    f. P6:
    g. Flop:
    h. Turn:
    i. River:

Expected:
    Winner:
    P1 Percentage:
    P1 Color:
    P2 Percentage:
    P2 Color:
    P3 Percentage:
    P3 Color:
    P4 Percentage:
    P4 Color:
    P5 Percentage:
    P5 Color:
    P6 Percentage:
    P6 Color:

Expected Output:
    Table:
    P1 Hand:
    P1 Equity:
    P1 Wins:
    P1 Ties:
    P2 Hand:
    P2 Equity:
    P2 Wins:
    P2 Ties:
    P3 Hand:
    P3 Equity:
    P3 Wins:
    P3 Ties:
    P4 Hand:
    P4 Equity:
    P4 Wins:
    P4 Ties:
    P5 Hand:
    P5 Equity:
    P5 Wins:
    P5 Ties:
    P6 Hand:
    P6 Equity:
    P6 Wins:
    P6 Ties:


### Multiple Output
1. Run multiple simulations.

Expected: The most recent output should be at the top.


### Reset
1. Run a simulation.
2. Click the reset button.

Expected: All cards should be reset.
    Board: Board should be reset to **Poker Board on Start**
    Modal: Modal dialog for all players should be reset. There should be no greyed out or selected cards.


### Replay
1. Run a simulation.
2. Click the reset button (the following conditions in the **Reset** case should be checked).
3. Click the replay button.

Expected: All cards from the simulation should be re-populated.