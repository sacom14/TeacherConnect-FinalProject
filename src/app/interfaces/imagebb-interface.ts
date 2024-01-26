export interface ImageBbResponse {
  data:    Data;
  success: boolean;
  status:  number;
}

export interface Data {
  id:          string;
  title:       string;
  url_viewer:  string;
  url:         string;
  display_url: string;
  width:       number;
  height:      number;
  size:        number;
  time:        number;
  expiration:  number;
  image:       Image;
  thumb:       Image;
  medium:      Image;
  delete_url:  string;
}

export interface Image {
  filename:  string;
  name:      string;
  mime:      string;
  extension: string;
  url:       string;
}
