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
  a. P1: 4C 9C  
  b. P2: AC KC  
  c. Flop: 4S 2S 8C  
  d. Turn: 10D  
  e. River: --  

Expected:  

  + Winner: P1  
  + P1 Percentage: 73.54%
  + P1 Color: Green  
  + P2 Percentage: 26.46%
  + P2 Color: Blue  

Expected Output:

  + Table: 4S 2S 8C  
  + P1 Hand: 4C 9C  
  + P1 Equity: 73.54%  
  + P1 Wins: 728  
  + P1 Ties: 0  
  + P2 Hand: AC KC  
  + P2 Equity: 26.46%  
  + P2 Wins: 262  
  + P2 Ties: 0  


### Simulation 2
1. Run the following simulation.  
  a. P1: 2H 7D
  b. P2: JD 3C
  c. P3: 8H 4H  
  d. Flop: 9S 5C AH  
  e. Turn: 6C  
  f. River: --  

Expected:

  + Winner: P1
  + P1 Percentage:  14.29%
  + P1 Color: Blue
  + P2 Percentage: 71.43%
  + P2 Color: Green
  + P3 Percentage: 14.29%
  + P3 Color: Blue

Expected Output:

  + Table: 9S 5C AH 6C
  + P1 Hand: 2H 7D
  + P1 Equity: 14.29%
  + P1 Wins: 30
  + P1 Ties: 0
  + P2 Hand: JD 3C
  + P2 Equity: 71.43%
  + P2 Wins: 30
  + P2 Ties: 0
  + P3 Hand: 8H 4H
  + P3 Equity: 14.29%
  + P3 Wins: 6
  + P3 Ties: 0


### Simulation 3
1. Run the following simulation.  
  a. P1: 2H 2D
  b. P2: 4H 7C
  c. P3: 7S 3H
  d. P4: QD 8S
  e. Flop: 7H 9S KD
  f. Turn: QH
  g. River: 3S

Expected:
  + Winner: P3
  + P1 Percentage: 100.00%  
  + P1 Color: Green
  + P2 Percentage: 0.00%
  + P2 Color: Blue
  + P3 Percentage: 0.00%
  + P3 Color: Blue
  + P4 Percentage: 0.00%
  + P4 Color: Blue

Expected Output:
  + Table:
  + P1 Hand:
  + P1 Equity:
  + P1 Wins:
  + P1 Ties:
  + P2 Hand:
  + P2 Equity:
  + P2 Wins:
  + P2 Ties:
  + P3 Hand:
  + P3 Equity:
  + P3 Wins:
  + P3 Ties:
  + P4 Hand:
  + P4 Equity:
  + P4 Wins:
  + P4 Ties:


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
  + Winner:
  + P1 Percentage:
  + P1 Color:
  + P2 Percentage:
  + P2 Color:
  + P3 Percentage:
  + P3 Color:
  + P4 Percentage:
  + P4 Color:
  + P5 Percentage:
  + P5 Color:

Expected Output:
  + Table:
  + P1 Hand:
  + P1 Equity:
  + P1 Wins:
  + P1 Ties:
  + P2 Hand:
  + P2 Equity:
  + P2 Wins:
  + P2 Ties:
  + P3 Hand:
  + P3 Equity:
  + P3 Wins:
  + P3 Ties:
  + P4 Hand:
  + P4 Equity:
  + P4 Wins:
  + P4 Ties:
  + P5 Hand:
  + P5 Equity:
  + P5 Wins:
  + P5 Ties:


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
  + Winner:
  + P1 Percentage:
  + P1 Color:
  + P2 Percentage:
  + P2 Color:
  + P3 Percentage:
  + P3 Color:
  + P4 Percentage:
  + P4 Color:
  + P5 Percentage:
  + P5 Color:
  + P6 Percentage:
  + P6 Color:

Expected Output:
  + Table:
  + P1 Hand:
  + P1 Equity:
  + P1 Wins:
  + P1 Ties:
  + P2 Hand:
  + P2 Equity:
  + P2 Wins:
  + P2 Ties:
  + P3 Hand:
  + P3 Equity:
  + P3 Wins:
  + P3 Ties:
  + P4 Hand:
  + P4 Equity:
  + P4 Wins:
  + P4 Ties:
  + P5 Hand:
  + P5 Equity:
  + P5 Wins:
  + P5 Ties:
  + P6 Hand:
  + P6 Equity:
  + P6 Wins:
  + P6 Ties:

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