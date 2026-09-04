import type { Appointment } from "../types";
import { apptsOn, byId } from "../utils/selectors";
import { dayNum, displayTime, isSameMonth, isToday, monthGrid } from "../utils/date";

const DOW_HEADS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MAX_CHIPS = 3;

interface Props {
  viewDate: string;
  appts: Appointment[];
  onPickDay: (date: string) => void;
  onOpenClient: (clientId: string) => void;
  onBook: (date: string) => void;
}

/**
 * Full-month view. Every cell is a booking target — clicking empty space in a
 * day opens the dialog pre-filled with that date.
 */
export function MonthGrid({ viewDate, appts, onPickDay, onOpenClient, onBook }: Props) {
  const weeks = monthGrid(viewDate);

  return (
    <div className="month-grid-wrap">
      <div className="month-dow-row">
        {DOW_HEADS.map((d) => (
          <div className="month-dow" key={d}>{d}</div>
        ))}
      </div>
      <div className="month-grid">
        {weeks.map((week) =>
          week.map((date) => {
            const dayAppts = apptsOn(date, appts);
            const outside = !isSameMonth(date, viewDate);
            const classes = ["month-cell"];
            if (outside) classes.push("month-cell-outside");
            if (isToday(date)) classes.push("month-cell-today");

            return (
              <div className={classes.join(" ")} key={date}>
                <div className="month-cell-head">
                  <button
                    type="button"
                    className="month-daynum"
                    onClick={() => onPickDay(date)}
                    title={`Open ${date} in the day view`}
                  >
                    {dayNum(date)}
                  </button>
                  <button
                    type="button"
                    className="month-add"
                    onClick={() => onBook(date)}
                    title={`Book an appointment on ${date}`}
                    aria-label={`Book an appointment on ${date}`}
                  >
                    +
                  </button>
                </div>
                <div className="month-cell-body">
                  {dayAppts.slice(0, MAX_CHIPS).map((a) => (
                    <button
                      type="button"
                      className="month-chip"
                      key={a.id}
                      onClick={() => onOpenClient(a.client)}
                      title={`${displayTime(a.time)} · ${byId(a.client).name} · ${a.type}`}
                    >
                      <span className="month-chip-time">{displayTime(a.time)}</span>
                      <span className="month-chip-client">{byId(a.client).name}</span>
                    </button>
                  ))}
                  {dayAppts.length > MAX_CHIPS && (
                    <button type="button" className="month-more" onClick={() => onPickDay(date)}>
                      +{dayAppts.length - MAX_CHIPS} more
                    </button>
                  )}
                </div>
              </div>
            );
          }),
        )}
      </div>
    </div>
  );
}
