-- Fix Vietnamese text that was saved as Windows-1252 mojibake, for example:
-- "HÃ  Ná»™i" -> "Hà Nội".
-- This script updates only values that still contain mojibake marker characters.

create or replace function fix_mojibake_text(value text)
returns text
language plpgsql
as $$
begin
  if value is null or value !~ '[ÃÄÆÅð»º™œ€]' then
    return value;
  end if;

  return convert_from(convert_to(value, 'WIN1252'), 'UTF8');
exception when others then
  return value;
end;
$$;

update tour_types
set
  name_type = fix_mojibake_text(name_type),
  "description" = fix_mojibake_text("description")
where name_type ~ '[ÃÄÆÅð»º™œ€]' or "description" ~ '[ÃÄÆÅð»º™œ€]';

update destinations
set
  name_des = fix_mojibake_text(name_des),
  location = fix_mojibake_text(location),
  country = fix_mojibake_text(country),
  region = fix_mojibake_text(region)
where name_des ~ '[ÃÄÆÅð»º™œ€]'
   or location ~ '[ÃÄÆÅð»º™œ€]'
   or country ~ '[ÃÄÆÅð»º™œ€]'
   or region ~ '[ÃÄÆÅð»º™œ€]';

update promotions
set
  title = fix_mojibake_text(title),
  "description" = fix_mojibake_text("description")
where title ~ '[ÃÄÆÅð»º™œ€]' or "description" ~ '[ÃÄÆÅð»º™œ€]';

update admins
set name = fix_mojibake_text(name)
where name ~ '[ÃÄÆÅð»º™œ€]';

update customers
set
  name = fix_mojibake_text(name),
  address = fix_mojibake_text(address)
where name ~ '[ÃÄÆÅð»º™œ€]' or address ~ '[ÃÄÆÅð»º™œ€]';

update images
set caption = fix_mojibake_text(caption)
where caption ~ '[ÃÄÆÅð»º™œ€]';

update tour_images
set caption = fix_mojibake_text(caption)
where caption ~ '[ÃÄÆÅð»º™œ€]';

update tours
set
  title = fix_mojibake_text(title),
  "description" = fix_mojibake_text("description"),
  departure_place = fix_mojibake_text(departure_place)
where title ~ '[ÃÄÆÅð»º™œ€]'
   or "description" ~ '[ÃÄÆÅð»º™œ€]'
   or departure_place ~ '[ÃÄÆÅð»º™œ€]';

update itineraries
set
  title = fix_mojibake_text(title),
  "description" = fix_mojibake_text("description")
where title ~ '[ÃÄÆÅð»º™œ€]' or "description" ~ '[ÃÄÆÅð»º™œ€]';

update reviews
set comment = fix_mojibake_text(comment)
where comment ~ '[ÃÄÆÅð»º™œ€]';

update contact_messages
set
  name = fix_mojibake_text(name),
  subject = fix_mojibake_text(subject),
  message = fix_mojibake_text(message)
where name ~ '[ÃÄÆÅð»º™œ€]'
   or subject ~ '[ÃÄÆÅð»º™œ€]'
   or message ~ '[ÃÄÆÅð»º™œ€]';

update participants
set customer_name = fix_mojibake_text(customer_name)
where customer_name ~ '[ÃÄÆÅð»º™œ€]';

drop function fix_mojibake_text(text);
