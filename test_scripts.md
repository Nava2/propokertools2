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
  + P1 Percentage: 86.36%
  + P1 Color: Green  
  + P2 Percentage: 13.64%
  + P2 Color: Blue  

Expected Output:

  + Table: 4S 2S 8C  
  + P1 Hand: 4C 9C  
  + P1 Equity: 86.36%
  + P1 Wins: 38
  + P1 Ties: 0  
  + P2 Hand: AC KC  
  + P2 Equity: 13.64%
  + P2 Wins: 6
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
  + P1 Wins: 6
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
  + P1 Percentage: 0.00
  + P1 Color: Blue
  + P2 Percentage: 0.00%
  + P2 Color: Blue
  + P3 Percentage: 100.00%
  + P3 Color: Green
  + P4 Percentage: 0.00%
  + P4 Color: Blue

Expected Output:

  + Table: 7H 9S KD QH 3S
  + P1 Hand: 2H 2D
  + P1 Equity: 0.00%
  + P1 Wins: 0
  + P1 Ties: 0
  + P2 Hand: 4H 7C
  + P2 Equity: 0.00%
  + P2 Wins: 0
  + P2 Ties: 0
  + P3 Hand: 7S 3H
  + P3 Equity: 100.00%
  + P3 Wins: 1
  + P3 Ties: 0
  + P4 Hand: QD 8S
  + P4 Equity: 0.00%
  + P4 Wins: 0
  + P4 Ties: 0


### Simulation 4
1. Run the following simulation.  
  a. P1: 50%-90%  
  b. P2: AS 9H  
  c. P3: 2H 6C  
  d. P4: 30%-45%  
  e. P5: 10%-30%  
  f. Flop: 6H QD 9S  
  g. Turn: 7H  
  h. River: KC  

Expected:

  + Winner: P5
  + P1 Percentage: 13.12%
  + P1 Color: Blue
  + P2 Percentage: 18.86%
  + P2 Color: Blue
  + P3 Percentage: 0.00%
  + P3 Color: Blue
  + P4 Percentage: 28.93%
  + P4 Color: Blue
  + P5 Percentage: 39.09%
  + P5 Color: Green

Expected Output:

  + Table: 6H QD 9S 7H KC
  + P1 Hand: 50%-90%
  + P1 Equity: 13.12%
  + P1 Wins: 76.5k
  + P1 Ties: 4.4k
  + P2 Hand: AS 9H
  + P2 Equity: 18.86%
  + P2 Wins: 109.6k
  + P2 Ties: 7k
  + P3 Hand: 2H 6C
  + P3 Equity: 0.00%
  + P3 Wins: 0
  + P3 Ties: 0
  + P4 Hand: 30%-45%
  + P4 Equity: 28.93%
  + P4 Wins: 170.6k
  + P4 Ties: 5.8k
  + P5 Hand: 10%-30%
  + P5 Equity: 39.09%
  + P5 Wins: 229.5k
  + P5 Ties: 10.1k


### Simulation 5
1. Run the following simulation.  
  a. P1: 50%-95%  
  b. P2: AS AH  
  c. P3: 2H 6C  
  d. P4: 20%-45%  
  e. P5: 5%-30%  
  f. P6: JH JS  
  g. Flop: 3H QD 9S  
  h. Turn: 7H  
  i. River: KC  

Expected:

  + Winner: P2
  + P1 Percentage: 7.22%
  + P1 Color: Blue
  + P2 Percentage: 54.86%
  + P2 Color: Green
  + P3 Percentage: 2H 6C
  + P3 Color: 0.00%
  + P4 Percentage: 17.23%
  + P4 Color: Blue
  + P5 Percentage: 5%-30%
  + P5 Color: Blue
  + P6 Percentage: 0.00%
  + P6 Color: Blue

Expected Output:

  + Table: 3H QD 9S 7H KC
  + P1 Hand: 50%-95%
  + P1 Equity: 7.22%
  + P1 Wins: 43.2k
  + P1 Ties: 194
  + P2 Hand: AS AH
  + P2 Equity: 54.86%
  + P2 Wins: 329.1k
  + P2 Ties: 0
  + P3 Hand: 2H 6C
  + P3 Equity: 0.00%
  + P3 Wins: 0
  + P3 Ties: 0
  + P4 Hand: 20%-45%
  + P4 Equity: 17.23%
  + P4 Wins: 102.7k
  + P4 Ties: 1.2k
  + P5 Hand: 5%-30%
  + P5 Equity: 20.70%
  + P5 Wins: 123.5k
  + P5 Ties: 1.1k
  + P6 Hand: JH JS
  + P6 Equity: 0.00%
  + P6 Wins: 0
  + P6 Ties: 0

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