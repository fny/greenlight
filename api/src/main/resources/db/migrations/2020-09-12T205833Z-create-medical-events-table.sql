CREATE TABLE medical_events (
    event_type text not null,
    occurred_at timestamp not null,
    created_at timestamp not nulldefault now()
);

CREATE INDEX medical_events_event_type_idx ON medical_events(event_type);
