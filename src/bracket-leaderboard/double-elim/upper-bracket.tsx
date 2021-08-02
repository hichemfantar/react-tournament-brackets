import React from 'react';
import { calculatePositionOfMatch } from './calculate-match-position';
import MatchWrapper from '../match-wrapper';
import Connectors from '../single-elim/connectors';

const UpperBracket = ({
  columns,
  calculatedStyles,
  gameHeight,
  gameWidth,
  onMatchClick,
  onPartyClick,
  matchComponent,
}) => {
  const { canvasPadding, columnWidth, rowHeight, roundHeader } =
    calculatedStyles;
  return columns.map((matchesColumn, columnIndex) =>
    matchesColumn.map((match, rowIndex) => {
      const { x, y } = calculatePositionOfMatch(rowIndex, columnIndex, {
        canvasPadding,
        columnWidth,
        rowHeight,
      });

      return (
        <>
          {columnIndex !== 0 && (
            <Connectors
              {...{
                columns,
                rowIndex,
                columnIndex,
                gameHeight,
                gameWidth,
                style: calculatedStyles,
              }}
            />
          )}
          <g>
            <MatchWrapper
              x={x}
              y={
                y +
                (roundHeader.isShown
                  ? roundHeader.height + roundHeader.marginBottom
                  : 0)
              }
              rowIndex={rowIndex}
              columnIndex={columnIndex}
              match={match}
              topText={match.startTime}
              bottomText={match.name}
              teams={match.participants}
              onMatchClick={onMatchClick}
              onPartyClick={onPartyClick}
              style={calculatedStyles}
              matchComponent={matchComponent}
            />
          </g>
        </>
      );
    })
  );
};
export default UpperBracket;