CREATE TABLE public."Users" (
    user_id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(255) not null,
    email VARCHAR(255) not null,
	password VARCHAR(255) not null,
	image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_email ON public."Users"(email);