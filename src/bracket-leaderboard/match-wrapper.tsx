import React, { useContext } from 'react';
import { matchContext } from './match-context';
import { MATCH_STATES } from './match-states';
import { defaultStyle, getCalculatedStyles } from './settings';

function Match({
  rowIndex,
  columnIndex,
  match,
  teams,
  topText,
  bottomText,
  style = defaultStyle,
  matchComponent: MatchComponent,
  onMatchClick,
  onPartyClick,
  ...rest
}) {
  const {
    state: { hoveredPartyId },
    dispatch,
  } = useContext(matchContext);
  const computedStyles = getCalculatedStyles(style);
  const { width = 300, boxHeight = 70, connectorColor } = computedStyles;

  const topParty = teams?.[0]
    ? { ...teams[0], name: teams[0].name, resultText: teams[0].resultText }
    : {};
  const bottomParty = teams?.[1]
    ? { ...teams[1], name: teams[1].name, resultText: teams[1].resultText }
    : {};

  const topHovered =
    !Number.isNaN(hoveredPartyId) &&
    topParty?.id !== undefined &&
    hoveredPartyId === topParty.id;
  const bottomHovered =
    !Number.isNaN(hoveredPartyId) &&
    bottomParty?.id !== undefined &&
    hoveredPartyId === bottomParty.id;

  // Lower placement is better
  const topWon = topParty.status === MATCH_STATES.WALKOVER || topParty.isWinner;
  const bottomWon =
    bottomParty.status === MATCH_STATES.WALKOVER || bottomParty.isWinner;

  const matchState = MATCH_STATES[match.state];

  const teamNameFallback = matchState === MATCH_STATES.WALKOVER ? '' : 'TBD';
  const resultFallback = participant =>
    ({
      [MATCH_STATES.WALKOVER]: computedStyles.wonBywalkOverText,
      [MATCH_STATES.NO_SHOW]: computedStyles.lostByNoShowText,
      [MATCH_STATES.NO_PARTY]: computedStyles.lostByNoShowText,
    }[participant.status] ?? '');

  const onMouseEnter = partyId => {
    dispatch({
      type: 'SET_HOVERED_PARTYID',
      payload: {
        partyId,
        matchId: match.id,
        rowIndex,
        columnIndex,
      },
    });
  };
  const onMouseLeave = () => {
    dispatch({ type: 'SET_HOVERED_PARTYID', payload: null });
  };

  bottomParty.name = bottomParty.name || teamNameFallback;
  bottomParty.resultText =
    bottomParty.resultText || resultFallback(bottomParty);
  topParty.name = topParty.name || teamNameFallback;
  topParty.resultText = topParty.resultText || resultFallback(bottomParty);
  return (
    <svg
      width={width}
      height={boxHeight}
      viewBox={`0 0 ${width} ${boxHeight}`}
      {...rest}
    >
      <foreignObject x={0} y={0} width={width} height={boxHeight}>
        {/* TODO: Add OnClick Match handler */}
        {MatchComponent && (
          <MatchComponent
            {...{
              match,
              onMatchClick,
              onPartyClick,
              onMouseEnter,
              onMouseLeave,
              topParty,
              bottomParty,
              topWon,
              bottomWon,
              topHovered,
              bottomHovered,
              topText,
              bottomText,
              connectorColor,
              computedStyles,
              teamNameFallback,
              resultFallback,
            }}
          />
        )}
      </foreignObject>
    </svg>
  );
}

export default Match;