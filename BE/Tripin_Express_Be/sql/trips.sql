
CREATE TABLE public."Trips" (
    trip_id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    owner_id bigint REFERENCES public."Users"(user_id),
    destination VARCHAR(255),
    start_date DATE,
    end_date DATE,
    total_cost DECIMAL(10,2),
    budget DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_trip ON public."Trips"(trip_id);
CREATE INDEX idx_owner ON public."Trips"(owner_id);
CREATE INDEX idx_trip_owner ON public."Trips"(owner_id, trip_id);
