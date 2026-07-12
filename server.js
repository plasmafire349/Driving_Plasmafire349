const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// HTML embedded as base64 — no public/ folder needed on Render
const HTML = Buffer.from('PCFET0NUWVBFIGh0bWw+CjxodG1sIGxhbmc9ImVuIj4KPGhlYWQ+CjxtZXRhIGNoYXJzZXQ9IlVURi04IiAvPgo8bWV0YSBuYW1lPSJ2aWV3cG9ydCIgY29udGVudD0id2lkdGg9ZGV2aWNlLXdpZHRoLCBpbml0aWFsLXNjYWxlPTEuMCIgLz4KPHRpdGxlPkFqb2tvcnR0aSBRdWl6IOKAlCBNdWx0aXBsYXllciBEcml2aW5nIFRoZW9yeTwvdGl0bGU+CjxzY3JpcHQgc3JjPSIvc29ja2V0LmlvL3NvY2tldC5pby5qcyI+PC9zY3JpcHQ+CjxzdHlsZT4KICA6cm9vdCB7CiAgICAtLW5hdnk6ICMwQjI1NDU7CiAgICAtLW5hdnktMjogIzEzMzE1QzsKICAgIC0tc2lnbi15ZWxsb3c6ICNGRkQ0MDA7CiAgICAtLXNpZ24tcmVkOiAjRDcyNjNEOwogICAgLS1zaWduLWJsdWU6ICMxRjZGRUI7CiAgICAtLXdoaXRlOiAjRjdGOUZDOwogICAgLS1ncmV5OiAjOENBMEIzOwogICAgLS1zdWNjZXNzOiAjMkZCRjcxOwogICAgLS1mb250LWRpc3BsYXk6ICdBcmlhbCBCbGFjaycsICdIZWx2ZXRpY2EgTmV1ZScsIHNhbnMtc2VyaWY7CiAgICAtLWZvbnQtYm9keTogJ1NlZ29lIFVJJywgUm9ib3RvLCBzYW5zLXNlcmlmOwogIH0KICAqIHsgYm94LXNpemluZzogYm9yZGVyLWJveDsgfQogIGJvZHkgewogICAgbWFyZ2luOiAwOwogICAgbWluLWhlaWdodDogMTAwdmg7CiAgICBiYWNrZ3JvdW5kOiByYWRpYWwtZ3JhZGllbnQoY2lyY2xlIGF0IDIwJSAtMTAlLCAjMTY0MDZlIDAlLCB2YXIoLS1uYXZ5KSA1NSUsICMwNjEyMjUgMTAwJSk7CiAgICBmb250LWZhbWlseTogdmFyKC0tZm9udC1ib2R5KTsKICAgIGNvbG9yOiB2YXIoLS13aGl0ZSk7CiAgICBkaXNwbGF5OiBmbGV4OwogICAgYWxpZ24taXRlbXM6IGNlbnRlcjsKICAgIGp1c3RpZnktY29udGVudDogY2VudGVyOwogICAgcGFkZGluZzogMjBweDsKICB9CiAgLmNhcmQgewogICAgd2lkdGg6IDEwMCU7CiAgICBtYXgtd2lkdGg6IDUyMHB4OwogICAgYmFja2dyb3VuZDogcmdiYSgyNTUsMjU1LDI1NSwwLjA1KTsKICAgIGJvcmRlcjogMnB4IHNvbGlkIHJnYmEoMjU1LDI1NSwyNTUsMC4xMik7CiAgICBib3JkZXItcmFkaXVzOiAyMHB4OwogICAgcGFkZGluZzogMzJweDsKICAgIGJhY2tkcm9wLWZpbHRlcjogYmx1cig2cHgpOwogICAgYm94LXNoYWRvdzogMCAyMHB4IDYwcHggcmdiYSgwLDAsMCwwLjQpOwogIH0KICBoMSB7CiAgICBmb250LWZhbWlseTogdmFyKC0tZm9udC1kaXNwbGF5KTsKICAgIGZvbnQtc2l6ZTogMjhweDsKICAgIGxldHRlci1zcGFjaW5nOiAwLjVweDsKICAgIG1hcmdpbjogMCAwIDRweDsKICAgIGRpc3BsYXk6IGZsZXg7CiAgICBhbGlnbi1pdGVtczogY2VudGVyOwogICAgZ2FwOiAxMHB4OwogIH0KICAuc3VidGl0bGUgeyBjb2xvcjogdmFyKC0tZ3JleSk7IG1hcmdpbi1ib3R0b206IDI0cHg7IGZvbnQtc2l6ZTogMTRweDsgfQogIC5yb2FkLXNpZ24gewogICAgd2lkdGg6IDQ2cHg7IGhlaWdodDogNDZweDsKICAgIGJhY2tncm91bmQ6IHZhcigtLXNpZ24tcmVkKTsKICAgIGJvcmRlci1yYWRpdXM6IDUwJTsKICAgIGRpc3BsYXk6IGZsZXg7IGFsaWduLWl0ZW1zOiBjZW50ZXI7IGp1c3RpZnktY29udGVudDogY2VudGVyOwogICAgZm9udC1mYW1pbHk6IHZhcigtLWZvbnQtZGlzcGxheSk7CiAgICBjb2xvcjogdmFyKC0td2hpdGUpOwogICAgZm9udC1zaXplOiAyMnB4OwogICAgZmxleC1zaHJpbms6IDA7CiAgICBib3gtc2hhZG93OiAwIDRweCAxMHB4IHJnYmEoMjE1LDM4LDYxLDAuNCk7CiAgfQogIGlucHV0W3R5cGU9dGV4dF0gewogICAgd2lkdGg6IDEwMCU7CiAgICBwYWRkaW5nOiAxNHB4IDE2cHg7CiAgICBib3JkZXItcmFkaXVzOiAxMnB4OwogICAgYm9yZGVyOiAycHggc29saWQgcmdiYSgyNTUsMjU1LDI1NSwwLjE1KTsKICAgIGJhY2tncm91bmQ6IHJnYmEoMjU1LDI1NSwyNTUsMC4wNik7CiAgICBjb2xvcjogdmFyKC0td2hpdGUpOwogICAgZm9udC1zaXplOiAxNnB4OwogICAgbWFyZ2luLWJvdHRvbTogMTRweDsKICAgIG91dGxpbmU6IG5vbmU7CiAgfQogIGlucHV0W3R5cGU9dGV4dF06Zm9jdXMgeyBib3JkZXItY29sb3I6IHZhcigtLXNpZ24teWVsbG93KTsgfQogIGlucHV0W3R5cGU9dGV4dF06OnBsYWNlaG9sZGVyIHsgY29sb3I6IHZhcigtLWdyZXkpOyB9CiAgYnV0dG9uIHsKICAgIHdpZHRoOiAxMDAlOwogICAgcGFkZGluZzogMTRweDsKICAgIGJvcmRlci1yYWRpdXM6IDEycHg7CiAgICBib3JkZXI6IG5vbmU7CiAgICBmb250LXNpemU6IDE2cHg7CiAgICBmb250LXdlaWdodDogNzAwOwogICAgY3Vyc29yOiBwb2ludGVyOwogICAgbWFyZ2luLWJvdHRvbTogMTBweDsKICAgIHRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjFzIGVhc2UsIGZpbHRlciAwLjE1cyBlYXNlOwogICAgZm9udC1mYW1pbHk6IHZhcigtLWZvbnQtYm9keSk7CiAgfQogIGJ1dHRvbjpob3ZlciB7IGZpbHRlcjogYnJpZ2h0bmVzcygxLjA4KTsgfQogIGJ1dHRvbjphY3RpdmUgeyB0cmFuc2Zvcm06IHNjYWxlKDAuOTgpOyB9CiAgLmJ0bi1wcmltYXJ5IHsgYmFja2dyb3VuZDogdmFyKC0tc2lnbi15ZWxsb3cpOyBjb2xvcjogdmFyKC0tbmF2eSk7IH0KICAuYnRuLXNlY29uZGFyeSB7IGJhY2tncm91bmQ6IHRyYW5zcGFyZW50OyBjb2xvcjogdmFyKC0td2hpdGUpOyBib3JkZXI6IDJweCBzb2xpZCByZ2JhKDI1NSwyNTUsMjU1LDAuMjUpOyB9CiAgLmJ0bi1ibHVlIHsgYmFja2dyb3VuZDogdmFyKC0tc2lnbi1ibHVlKTsgY29sb3I6IHdoaXRlOyB9CiAgLmhpZGRlbiB7IGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudDsgfQogIC5yb29tLWNvZGUgewogICAgZm9udC1mYW1pbHk6IHZhcigtLWZvbnQtZGlzcGxheSk7CiAgICBmb250LXNpemU6IDQwcHg7CiAgICBsZXR0ZXItc3BhY2luZzogNnB4OwogICAgdGV4dC1hbGlnbjogY2VudGVyOwogICAgY29sb3I6IHZhcigtLXNpZ24teWVsbG93KTsKICAgIG1hcmdpbjogMTBweCAwIDIwcHg7CiAgfQogIC5wbGF5ZXJzLWxpc3QgeyBsaXN0LXN0eWxlOiBub25lOyBwYWRkaW5nOiAwOyBtYXJnaW46IDAgMCAyMHB4OyB9CiAgLnBsYXllcnMtbGlzdCBsaSB7CiAgICBkaXNwbGF5OiBmbGV4OyBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47IGFsaWduLWl0ZW1zOiBjZW50ZXI7CiAgICBwYWRkaW5nOiAxMHB4IDE0cHg7CiAgICBiYWNrZ3JvdW5kOiByZ2JhKDI1NSwyNTUsMjU1LDAuMDYpOwogICAgYm9yZGVyLXJhZGl1czogMTBweDsKICAgIG1hcmdpbi1ib3R0b206IDhweDsKICAgIGZvbnQtd2VpZ2h0OiA2MDA7CiAgICBhbmltYXRpb246IHBvcEluIDAuMjVzIGVhc2U7CiAgfQogIEBrZXlmcmFtZXMgcG9wSW4geyBmcm9tIHsgb3BhY2l0eTowOyB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoNnB4KTt9IHRvIHtvcGFjaXR5OjE7IHRyYW5zZm9ybTp0cmFuc2xhdGVZKDApO30gfQogIC5zY29yZS1waWxsIHsKICAgIGJhY2tncm91bmQ6IHZhcigtLXNpZ24teWVsbG93KTsgY29sb3I6IHZhcigtLW5hdnkpOwogICAgcGFkZGluZzogM3B4IDEwcHg7IGJvcmRlci1yYWRpdXM6IDk5OXB4OyBmb250LXNpemU6IDEzcHg7CiAgfQogIC5wcm9ncmVzcy10cmFjayB7CiAgICB3aWR0aDogMTAwJTsgaGVpZ2h0OiAxMHB4OyBib3JkZXItcmFkaXVzOiA5OTlweDsKICAgIGJhY2tncm91bmQ6IHJnYmEoMjU1LDI1NSwyNTUsMC4xKTsKICAgIG92ZXJmbG93OiBoaWRkZW47CiAgICBtYXJnaW4tYm90dG9tOiAyMHB4OwogIH0KICAucHJvZ3Jlc3MtZmlsbCB7CiAgICBoZWlnaHQ6IDEwMCU7IGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCg5MGRlZywgdmFyKC0tc2lnbi15ZWxsb3cpLCB2YXIoLS1zaWduLXJlZCkpOwogICAgd2lkdGg6IDEwMCU7CiAgICB0cmFuc2l0aW9uOiB3aWR0aCAwLjFzIGxpbmVhcjsKICB9CiAgLnEtbGFiZWwgeyBjb2xvcjogdmFyKC0tZ3JleSk7IGZvbnQtc2l6ZTogMTNweDsgbWFyZ2luLWJvdHRvbTogNnB4OyBsZXR0ZXItc3BhY2luZzogMXB4OyB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlOyB9CiAgLnF1ZXN0aW9uLXRleHQgeyBmb250LXNpemU6IDIwcHg7IGZvbnQtd2VpZ2h0OiA3MDA7IG1hcmdpbi1ib3R0b206IDIwcHg7IGxpbmUtaGVpZ2h0OiAxLjQ7IH0KICAub3B0aW9uLWJ0biB7CiAgICB3aWR0aDogMTAwJTsKICAgIHRleHQtYWxpZ246IGxlZnQ7CiAgICBwYWRkaW5nOiAxNnB4OwogICAgYm9yZGVyLXJhZGl1czogMTJweDsKICAgIGJvcmRlcjogMnB4IHNvbGlkIHJnYmEoMjU1LDI1NSwyNTUsMC4xNSk7CiAgICBiYWNrZ3JvdW5kOiByZ2JhKDI1NSwyNTUsMjU1LDAuMDYpOwogICAgY29sb3I6IHZhcigtLXdoaXRlKTsKICAgIGZvbnQtc2l6ZTogMTVweDsKICAgIG1hcmdpbi1ib3R0b206IDEwcHg7CiAgICBjdXJzb3I6IHBvaW50ZXI7CiAgICB0cmFuc2l0aW9uOiBhbGwgMC4xNXMgZWFzZTsKICB9CiAgLm9wdGlvbi1idG46aG92ZXI6bm90KDpkaXNhYmxlZCkgeyBib3JkZXItY29sb3I6IHZhcigtLXNpZ24teWVsbG93KTsgYmFja2dyb3VuZDogcmdiYSgyNTUsMjEyLDAsMC4wOCk7IH0KICAub3B0aW9uLWJ0bi5jb3JyZWN0IHsgYmFja2dyb3VuZDogdmFyKC0tc3VjY2Vzcyk7IGJvcmRlci1jb2xvcjogdmFyKC0tc3VjY2Vzcyk7IGNvbG9yOiB3aGl0ZTsgfQogIC5vcHRpb24tYnRuLndyb25nIHsgYmFja2dyb3VuZDogdmFyKC0tc2lnbi1yZWQpOyBib3JkZXItY29sb3I6IHZhcigtLXNpZ24tcmVkKTsgY29sb3I6IHdoaXRlOyB9CiAgLm9wdGlvbi1idG46ZGlzYWJsZWQgeyBjdXJzb3I6IGRlZmF1bHQ7IG9wYWNpdHk6IDAuNzsgfQogIC5mZWVkYmFjayB7CiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7IGZvbnQtc2l6ZTogMThweDsgZm9udC13ZWlnaHQ6IDcwMDsgbWFyZ2luOiAxMHB4IDAgMjBweDsKICAgIGFuaW1hdGlvbjogcG9wSW4gMC4zcyBlYXNlOwogIH0KICAucG9kaXVtIHsKICAgIGRpc3BsYXk6IGZsZXg7IGFsaWduLWl0ZW1zOiBmbGV4LWVuZDsganVzdGlmeS1jb250ZW50OiBjZW50ZXI7IGdhcDogMTJweDsKICAgIG1hcmdpbjogMzBweCAwIDIwcHg7CiAgfQogIC5wb2RpdW0tc3BvdCB7IHRleHQtYWxpZ246IGNlbnRlcjsgfQogIC5wb2RpdW0tYmFyIHsKICAgIHdpZHRoOiA3NnB4OyBib3JkZXItcmFkaXVzOiAxMHB4IDEwcHggMCAwOwogICAgZGlzcGxheTogZmxleDsgYWxpZ24taXRlbXM6IGZsZXgtc3RhcnQ7IGp1c3RpZnktY29udGVudDogY2VudGVyOwogICAgcGFkZGluZy10b3A6IDhweDsgZm9udC1mYW1pbHk6IHZhcigtLWZvbnQtZGlzcGxheSk7IGZvbnQtc2l6ZTogMjJweDsKICAgIGFuaW1hdGlvbjogZ3Jvd1VwIDAuNnMgZWFzZTsKICB9CiAgQGtleWZyYW1lcyBncm93VXAgeyBmcm9tIHsgaGVpZ2h0OiAwICFpbXBvcnRhbnQ7IH0gfQogIC5wMSAucG9kaXVtLWJhciB7IGhlaWdodDogMTQwcHg7IGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCgxODBkZWcsIHZhcigtLXNpZ24teWVsbG93KSwgI0UwQjIwMCk7IGNvbG9yOiB2YXIoLS1uYXZ5KTsgfQogIC5wMiAucG9kaXVtLWJhciB7IGhlaWdodDogMTAwcHg7IGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCgxODBkZWcsICNDOEQxREIsICM5N0E1QjIpOyBjb2xvcjogdmFyKC0tbmF2eSk7IH0KICAucDMgLnBvZGl1bS1iYXIgeyBoZWlnaHQ6IDcwcHg7IGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCgxODBkZWcsICNDRDhBNEUsICNBOTY4MkYpOyBjb2xvcjogd2hpdGU7IH0KICAucG9kaXVtLW5hbWUgeyBmb250LXdlaWdodDogNzAwOyBtYXJnaW4tdG9wOiA4cHg7IGZvbnQtc2l6ZTogMTRweDsgfQogIC5wb2RpdW0tc2NvcmUgeyBjb2xvcjogdmFyKC0tc2lnbi15ZWxsb3cpOyBmb250LXNpemU6IDEzcHg7IH0KICAuY29uZmV0dGkgeyBwb3NpdGlvbjogZml4ZWQ7IHRvcDogLTEwcHg7IHdpZHRoOiA4cHg7IGhlaWdodDogMTRweDsgb3BhY2l0eTogMC45OyBhbmltYXRpb246IGZhbGwgbGluZWFyIGZvcndhcmRzOyB6LWluZGV4OiA1OyB9CiAgQGtleWZyYW1lcyBmYWxsIHsKICAgIHRvIHsgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDExMHZoKSByb3RhdGUoMzYwZGVnKTsgb3BhY2l0eTogMTsgfQogIH0KICAuZXJyb3ItbXNnIHsgY29sb3I6IHZhcigtLXNpZ24teWVsbG93KTsgYmFja2dyb3VuZDogcmdiYSgyMTUsMzgsNjEsMC4yNSk7IGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLXNpZ24tcmVkKTsgcGFkZGluZzogMTBweCAxNHB4OyBib3JkZXItcmFkaXVzOiAxMHB4OyBtYXJnaW4tYm90dG9tOiAxNHB4OyBmb250LXNpemU6IDE0cHg7IH0KICAuY29kZS1oaW50IHsgdGV4dC1hbGlnbjogY2VudGVyOyBjb2xvcjogdmFyKC0tZ3JleSk7IGZvbnQtc2l6ZTogMTNweDsgbWFyZ2luLXRvcDogLThweDsgbWFyZ2luLWJvdHRvbTogMTZweDsgfQogIC5zdHJpcGUgeyBoZWlnaHQ6IDRweDsgYmFja2dyb3VuZDogcmVwZWF0aW5nLWxpbmVhci1ncmFkaWVudCg5MGRlZywgdmFyKC0tc2lnbi15ZWxsb3cpIDAgMTZweCwgdHJhbnNwYXJlbnQgMTZweCAzMHB4KTsgYm9yZGVyLXJhZGl1czogNHB4OyBtYXJnaW46IDE4cHggMCAyNHB4OyBvcGFjaXR5OiAwLjY7IH0KPC9zdHlsZT4KPC9oZWFkPgo8Ym9keT4KCjxkaXYgY2xhc3M9ImNhcmQiIGlkPSJhcHAiPgoKICA8IS0tIEhPTUUgLS0+CiAgPGRpdiBpZD0idmlldy1ob21lIj4KICAgIDxoMT48c3BhbiBjbGFzcz0icm9hZC1zaWduIj7wn5qmPC9zcGFuPiBBam9rb3J0dGkgUXVpejwvaDE+CiAgICA8ZGl2IGNsYXNzPSJzdWJ0aXRsZSI+RmlubmlzaCBkcml2aW5nIHRoZW9yeSDigJQgcmFjZSB5b3VyIGZyaWVuZHMgdG8gdGhlIHRvcCBzY29yZTwvZGl2PgogICAgPGRpdiBjbGFzcz0ic3RyaXBlIj48L2Rpdj4KICAgIDxkaXYgaWQ9ImhvbWUtZXJyb3IiPjwvZGl2PgogICAgPGlucHV0IHR5cGU9InRleHQiIGlkPSJuYW1lLWlucHV0IiBwbGFjZWhvbGRlcj0iWW91ciBuYW1lIiBtYXhsZW5ndGg9IjE2IiAvPgogICAgPGJ1dHRvbiBjbGFzcz0iYnRuLXByaW1hcnkiIGlkPSJidG4tY3JlYXRlIj5DcmVhdGUgYSByb29tPC9idXR0b24+CiAgICA8aW5wdXQgdHlwZT0idGV4dCIgaWQ9ImpvaW4tY29kZS1pbnB1dCIgcGxhY2Vob2xkZXI9IlJvb20gY29kZSIgbWF4bGVuZ3RoPSI1IiBzdHlsZT0idGV4dC10cmFuc2Zvcm06dXBwZXJjYXNlIiAvPgogICAgPGJ1dHRvbiBjbGFzcz0iYnRuLWJsdWUiIGlkPSJidG4tam9pbiI+Sm9pbiByb29tPC9idXR0b24+CiAgPC9kaXY+CgogIDwhLS0gTE9CQlkgLS0+CiAgPGRpdiBpZD0idmlldy1sb2JieSIgY2xhc3M9ImhpZGRlbiI+CiAgICA8aDE+PHNwYW4gY2xhc3M9InJvYWQtc2lnbiI+8J+PgTwvc3Bhbj4gTG9iYnk8L2gxPgogICAgPGRpdiBjbGFzcz0ic3VidGl0bGUiPlNoYXJlIHRoaXMgY29kZSB3aXRoIHlvdXIgZnJpZW5kczwvZGl2PgogICAgPGRpdiBjbGFzcz0icm9vbS1jb2RlIiBpZD0ibG9iYnktY29kZSI+LS0tLS08L2Rpdj4KICAgIDxkaXYgY2xhc3M9ImNvZGUtaGludCI+V2FpdGluZyBmb3IgcGxheWVycyB0byBqb2luLi4uPC9kaXY+CiAgICA8dWwgY2xhc3M9InBsYXllcnMtbGlzdCIgaWQ9ImxvYmJ5LXBsYXllcnMiPjwvdWw+CiAgICA8YnV0dG9uIGNsYXNzPSJidG4tcHJpbWFyeSBoaWRkZW4iIGlkPSJidG4tc3RhcnQiPlN0YXJ0IGdhbWU8L2J1dHRvbj4KICAgIDxkaXYgaWQ9ImxvYmJ5LXdhaXQtbXNnIiBjbGFzcz0ic3VidGl0bGUiIHN0eWxlPSJ0ZXh0LWFsaWduOmNlbnRlcjsiPldhaXRpbmcgZm9yIHRoZSBob3N0IHRvIHN0YXJ0Li4uPC9kaXY+CiAgPC9kaXY+CgogIDwhLS0gUVVFU1RJT04gLS0+CiAgPGRpdiBpZD0idmlldy1xdWVzdGlvbiIgY2xhc3M9ImhpZGRlbiI+CiAgICA8ZGl2IGNsYXNzPSJxLWxhYmVsIiBpZD0icS1wcm9ncmVzcyI+UXVlc3Rpb24gMSAvIDEwPC9kaXY+CiAgICA8ZGl2IGNsYXNzPSJwcm9ncmVzcy10cmFjayI+PGRpdiBjbGFzcz0icHJvZ3Jlc3MtZmlsbCIgaWQ9InRpbWVyLWJhciI+PC9kaXY+PC9kaXY+CiAgICA8ZGl2IGNsYXNzPSJxdWVzdGlvbi10ZXh0IiBpZD0icS10ZXh0Ij48L2Rpdj4KICAgIDxkaXYgaWQ9Im9wdGlvbnMtY29udGFpbmVyIj48L2Rpdj4KICA8L2Rpdj4KCiAgPCEtLSBSRVZFQUwgLS0+CiAgPGRpdiBpZD0idmlldy1yZXZlYWwiIGNsYXNzPSJoaWRkZW4iPgogICAgPGRpdiBjbGFzcz0iZmVlZGJhY2siIGlkPSJyZXZlYWwtZmVlZGJhY2siPjwvZGl2PgogICAgPGRpdiBjbGFzcz0ic3VidGl0bGUiIHN0eWxlPSJ0ZXh0LWFsaWduOmNlbnRlcjsgbWFyZ2luLWJvdHRvbToxNHB4OyI+U3RhbmRpbmdzPC9kaXY+CiAgICA8dWwgY2xhc3M9InBsYXllcnMtbGlzdCIgaWQ9InJldmVhbC1wbGF5ZXJzIj48L3VsPgogIDwvZGl2PgoKICA8IS0tIEdBTUUgT1ZFUiAtLT4KICA8ZGl2IGlkPSJ2aWV3LWdhbWVvdmVyIiBjbGFzcz0iaGlkZGVuIj4KICAgIDxoMSBzdHlsZT0ianVzdGlmeS1jb250ZW50OmNlbnRlcjsiPjxzcGFuIGNsYXNzPSJyb2FkLXNpZ24iPvCfj4Y8L3NwYW4+IEdhbWUgT3ZlciE8L2gxPgogICAgPGRpdiBjbGFzcz0icG9kaXVtIiBpZD0icG9kaXVtIj48L2Rpdj4KICAgIDx1bCBjbGFzcz0icGxheWVycy1saXN0IiBpZD0iZmluYWwtcGxheWVycyI+PC91bD4KICAgIDxidXR0b24gY2xhc3M9ImJ0bi1wcmltYXJ5IGhpZGRlbiIgaWQ9ImJ0bi1hZ2FpbiI+UGxheSBhZ2FpbjwvYnV0dG9uPgogICAgPGRpdiBpZD0iZ2FtZW92ZXItd2FpdCIgY2xhc3M9InN1YnRpdGxlIGhpZGRlbiIgc3R5bGU9InRleHQtYWxpZ246Y2VudGVyOyI+V2FpdGluZyBmb3IgaG9zdCB0byByZXN0YXJ0Li4uPC9kaXY+CiAgPC9kaXY+Cgo8L2Rpdj4KCjxzY3JpcHQ+CmNvbnN0IHNvY2tldCA9IGlvKCk7CmxldCBteUNvZGUgPSBudWxsOwpsZXQgaXNIb3N0ID0gZmFsc2U7CmxldCB0aW1lckludGVydmFsID0gbnVsbDsKCmNvbnN0IHZpZXdzID0gWydob21lJywnbG9iYnknLCdxdWVzdGlvbicsJ3JldmVhbCcsJ2dhbWVvdmVyJ107CmZ1bmN0aW9uIHNob3codmlldykgewogIHZpZXdzLmZvckVhY2godiA9PiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndmlldy0nK3YpLmNsYXNzTGlzdC50b2dnbGUoJ2hpZGRlbicsIHYgIT09IHZpZXcpKTsKfQoKLy8gLS0tLS0tLS0tLSBIT01FIC0tLS0tLS0tLS0KZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2J0bi1jcmVhdGUnKS5vbmNsaWNrID0gKCkgPT4gewogIGNvbnN0IG5hbWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmFtZS1pbnB1dCcpLnZhbHVlLnRyaW0oKTsKICBpZiAoIW5hbWUpIHJldHVybiBzaG93SG9tZUVycm9yKCdFbnRlciB5b3VyIG5hbWUgZmlyc3QuJyk7CiAgc29ja2V0LmVtaXQoJ2NyZWF0ZVJvb20nLCBuYW1lKTsKfTsKZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2J0bi1qb2luJykub25jbGljayA9ICgpID0+IHsKICBjb25zdCBuYW1lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25hbWUtaW5wdXQnKS52YWx1ZS50cmltKCk7CiAgY29uc3QgY29kZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdqb2luLWNvZGUtaW5wdXQnKS52YWx1ZS50cmltKCk7CiAgaWYgKCFuYW1lKSByZXR1cm4gc2hvd0hvbWVFcnJvcignRW50ZXIgeW91ciBuYW1lIGZpcnN0LicpOwogIGlmICghY29kZSkgcmV0dXJuIHNob3dIb21lRXJyb3IoJ0VudGVyIGEgcm9vbSBjb2RlLicpOwogIHNvY2tldC5lbWl0KCdqb2luUm9vbScsIHsgY29kZSwgbmFtZSB9KTsKfTsKZnVuY3Rpb24gc2hvd0hvbWVFcnJvcihtc2cpIHsKICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaG9tZS1lcnJvcicpLmlubmVySFRNTCA9IGA8ZGl2IGNsYXNzPSJlcnJvci1tc2ciPiR7bXNnfTwvZGl2PmA7Cn0KCnNvY2tldC5vbignZXJyb3JNc2cnLCAobXNnKSA9PiBzaG93SG9tZUVycm9yKG1zZykpOwoKc29ja2V0Lm9uKCdyb29tQ3JlYXRlZCcsICh7IGNvZGUsIHBsYXllcnMsIGlzSG9zdDogaG9zdCB9KSA9PiB7CiAgbXlDb2RlID0gY29kZTsgaXNIb3N0ID0gaG9zdDsKICBlbnRlckxvYmJ5KGNvZGUsIHBsYXllcnMpOwp9KTsKc29ja2V0Lm9uKCdyb29tSm9pbmVkJywgKHsgY29kZSwgcGxheWVycywgaXNIb3N0OiBob3N0IH0pID0+IHsKICBteUNvZGUgPSBjb2RlOyBpc0hvc3QgPSBob3N0OwogIGVudGVyTG9iYnkoY29kZSwgcGxheWVycyk7Cn0pOwoKZnVuY3Rpb24gZW50ZXJMb2JieShjb2RlLCBwbGF5ZXJzKSB7CiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xvYmJ5LWNvZGUnKS50ZXh0Q29udGVudCA9IGNvZGU7CiAgcmVuZGVyUGxheWVycygnbG9iYnktcGxheWVycycsIHBsYXllcnMpOwogIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdidG4tc3RhcnQnKS5jbGFzc0xpc3QudG9nZ2xlKCdoaWRkZW4nLCAhaXNIb3N0KTsKICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbG9iYnktd2FpdC1tc2cnKS5jbGFzc0xpc3QudG9nZ2xlKCdoaWRkZW4nLCBpc0hvc3QpOwogIHNob3coJ2xvYmJ5Jyk7Cn0KCnNvY2tldC5vbignbG9iYnlVcGRhdGUnLCAoeyBwbGF5ZXJzIH0pID0+IHsKICByZW5kZXJQbGF5ZXJzKCdsb2JieS1wbGF5ZXJzJywgcGxheWVycyk7Cn0pOwoKZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2J0bi1zdGFydCcpLm9uY2xpY2sgPSAoKSA9PiB7CiAgc29ja2V0LmVtaXQoJ3N0YXJ0R2FtZScsIG15Q29kZSk7Cn07CgpmdW5jdGlvbiByZW5kZXJQbGF5ZXJzKGVsSWQsIHBsYXllcnMpIHsKICBjb25zdCBlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVsSWQpOwogIGVsLmlubmVySFRNTCA9IHBsYXllcnMubWFwKHAgPT4gYDxsaT48c3Bhbj4ke2VzY2FwZUh0bWwocC5uYW1lKX08L3NwYW4+PHNwYW4gY2xhc3M9InNjb3JlLXBpbGwiPiR7cC5zY29yZX0gcHRzPC9zcGFuPjwvbGk+YCkuam9pbignJyk7Cn0KCmZ1bmN0aW9uIGVzY2FwZUh0bWwocykgewogIGNvbnN0IGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTsgZC50ZXh0Q29udGVudCA9IHM7IHJldHVybiBkLmlubmVySFRNTDsKfQoKLy8gLS0tLS0tLS0tLSBRVUVTVElPTiAtLS0tLS0tLS0tCnNvY2tldC5vbigncXVlc3Rpb24nLCAoeyBpbmRleCwgdG90YWwsIHEsIG9wdGlvbnMsIHRpbWVNcyB9KSA9PiB7CiAgc2hvdygncXVlc3Rpb24nKTsKICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncS1wcm9ncmVzcycpLnRleHRDb250ZW50ID0gYFF1ZXN0aW9uICR7aW5kZXh9IC8gJHt0b3RhbH1gOwogIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdxLXRleHQnKS50ZXh0Q29udGVudCA9IHE7CiAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ29wdGlvbnMtY29udGFpbmVyJyk7CiAgY29udGFpbmVyLmlubmVySFRNTCA9ICcnOwogIG9wdGlvbnMuZm9yRWFjaCgob3B0LCBpKSA9PiB7CiAgICBjb25zdCBidG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTsKICAgIGJ0bi5jbGFzc05hbWUgPSAnb3B0aW9uLWJ0bic7CiAgICBidG4udGV4dENvbnRlbnQgPSBvcHQ7CiAgICBidG4ub25jbGljayA9ICgpID0+IHNlbGVjdEFuc3dlcihpLCBidG4pOwogICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGJ0bik7CiAgfSk7CgogIGNvbnN0IGJhciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0aW1lci1iYXInKTsKICBiYXIuc3R5bGUudHJhbnNpdGlvbiA9ICdub25lJzsKICBiYXIuc3R5bGUud2lkdGggPSAnMTAwJSc7CiAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHsKICAgIGJhci5zdHlsZS50cmFuc2l0aW9uID0gYHdpZHRoICR7dGltZU1zfW1zIGxpbmVhcmA7CiAgICBiYXIuc3R5bGUud2lkdGggPSAnMCUnOwogIH0pOwp9KTsKCmxldCBhbnN3ZXJlZCA9IGZhbHNlOwpmdW5jdGlvbiBzZWxlY3RBbnN3ZXIoaSwgYnRuKSB7CiAgaWYgKGFuc3dlcmVkKSByZXR1cm47CiAgYW5zd2VyZWQgPSB0cnVlOwogIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5vcHRpb24tYnRuJykuZm9yRWFjaChiID0+IGIuZGlzYWJsZWQgPSB0cnVlKTsKICBidG4uc3R5bGUuYm9yZGVyQ29sb3IgPSAndmFyKC0tc2lnbi15ZWxsb3cpJzsKICBzb2NrZXQuZW1pdCgnc3VibWl0QW5zd2VyJywgeyBjb2RlOiBteUNvZGUsIGNob2ljZTogaSB9KTsKfQoKc29ja2V0Lm9uKCdhbnN3ZXJSZWNlaXZlZCcsICh7IGNvcnJlY3QsIGdhaW5lZCB9KSA9PiB7CiAgLy8gc3VidGxlIGltbWVkaWF0ZSBmZWVkYmFjayBoYW5kbGVkIGF0IHJldmVhbAp9KTsKCnNvY2tldC5vbigncmV2ZWFsJywgKHsgY29ycmVjdCwgcGxheWVycyB9KSA9PiB7CiAgYW5zd2VyZWQgPSBmYWxzZTsKICBjb25zdCBidG5zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLm9wdGlvbi1idG4nKTsKICBidG5zLmZvckVhY2goKGIsIGkpID0+IHsKICAgIGlmIChpID09PSBjb3JyZWN0KSBiLmNsYXNzTGlzdC5hZGQoJ2NvcnJlY3QnKTsKICB9KTsKICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmV2ZWFsLWZlZWRiYWNrJykudGV4dENvbnRlbnQgPSAnQ29ycmVjdCBhbnN3ZXIgaGlnaGxpZ2h0ZWQhJzsKICByZW5kZXJQbGF5ZXJzKCdyZXZlYWwtcGxheWVycycsIHBsYXllcnMpOwogIHNob3coJ3JldmVhbCcpOwp9KTsKCi8vIC0tLS0tLS0tLS0gR0FNRSBPVkVSIC0tLS0tLS0tLS0Kc29ja2V0Lm9uKCdnYW1lT3ZlcicsICh7IHBsYXllcnMgfSkgPT4gewogIHNob3coJ2dhbWVvdmVyJyk7CiAgcmVuZGVyUGxheWVycygnZmluYWwtcGxheWVycycsIHBsYXllcnMpOwogIGJ1aWxkUG9kaXVtKHBsYXllcnMpOwogIGxhdW5jaENvbmZldHRpKCk7CiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2J0bi1hZ2FpbicpLmNsYXNzTGlzdC50b2dnbGUoJ2hpZGRlbicsICFpc0hvc3QpOwogIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnYW1lb3Zlci13YWl0JykuY2xhc3NMaXN0LnRvZ2dsZSgnaGlkZGVuJywgaXNIb3N0KTsKfSk7CgpmdW5jdGlvbiBidWlsZFBvZGl1bShwbGF5ZXJzKSB7CiAgY29uc3QgcG9kaXVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BvZGl1bScpOwogIHBvZGl1bS5pbm5lckhUTUwgPSAnJzsKICBjb25zdCBvcmRlciA9IFsxLDAsMl07IC8vIDJuZCwgMXN0LCAzcmQgdmlzdWFsIG9yZGVyCiAgY29uc3QgbWVkYWxzID0gezA6J/CfpYcnLDE6J/CfpYgnLDI6J/CfpYknfTsKICBvcmRlci5mb3JFYWNoKHJhbmsgPT4gewogICAgY29uc3QgcCA9IHBsYXllcnNbcmFua107CiAgICBpZiAoIXApIHJldHVybjsKICAgIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpOwogICAgZGl2LmNsYXNzTmFtZSA9IGBwb2RpdW0tc3BvdCBwJHtyYW5rKzF9YDsKICAgIGRpdi5pbm5lckhUTUwgPSBgCiAgICAgIDxkaXYgY2xhc3M9InBvZGl1bS1iYXIiPiR7bWVkYWxzW3JhbmtdfTwvZGl2PgogICAgICA8ZGl2IGNsYXNzPSJwb2RpdW0tbmFtZSI+JHtlc2NhcGVIdG1sKHAubmFtZSl9PC9kaXY+CiAgICAgIDxkaXYgY2xhc3M9InBvZGl1bS1zY29yZSI+JHtwLnNjb3JlfSBwdHM8L2Rpdj4KICAgIGA7CiAgICBwb2RpdW0uYXBwZW5kQ2hpbGQoZGl2KTsKICB9KTsKfQoKZnVuY3Rpb24gbGF1bmNoQ29uZmV0dGkoKSB7CiAgY29uc3QgY29sb3JzID0gWycjRkZENDAwJywnI0Q3MjYzRCcsJyMxRjZGRUInLCcjMkZCRjcxJywnI0Y3RjlGQyddOwogIGZvciAobGV0IGkgPSAwOyBpIDwgNjA7IGkrKykgewogICAgY29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTsKICAgIGVsLmNsYXNzTmFtZSA9ICdjb25mZXR0aSc7CiAgICBlbC5zdHlsZS5sZWZ0ID0gTWF0aC5yYW5kb20oKSAqIDEwMCArICd2dyc7CiAgICBlbC5zdHlsZS5iYWNrZ3JvdW5kID0gY29sb3JzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSpjb2xvcnMubGVuZ3RoKV07CiAgICBlbC5zdHlsZS5hbmltYXRpb25EdXJhdGlvbiA9ICgyICsgTWF0aC5yYW5kb20oKSAqIDIpICsgJ3MnOwogICAgZWwuc3R5bGUuYW5pbWF0aW9uRGVsYXkgPSAoTWF0aC5yYW5kb20oKSAqIDAuNSkgKyAncyc7CiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGVsKTsKICAgIHNldFRpbWVvdXQoKCkgPT4gZWwucmVtb3ZlKCksIDQ1MDApOwogIH0KfQoKZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2J0bi1hZ2FpbicpLm9uY2xpY2sgPSAoKSA9PiB7CiAgc29ja2V0LmVtaXQoJ3BsYXlBZ2FpbicsIG15Q29kZSk7Cn07Cgpzb2NrZXQub24oJ2JhY2tUb0xvYmJ5JywgKHsgcGxheWVycyB9KSA9PiB7CiAgZW50ZXJMb2JieShteUNvZGUsIHBsYXllcnMpOwp9KTsKPC9zY3JpcHQ+CjwvYm9keT4KPC9odG1sPgo=', 'base64').toString('utf-8');

app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(HTML);
});
// ---------- Question bank: Finnish driving theory (B-license) ----------
const QUESTIONS = [
  { q: "What is the default speed limit in built-up areas in Finland?", options: ["30 km/h", "40 km/h", "50 km/h", "60 km/h"], correct: 2 },
  { q: "What is the default speed limit outside built-up areas (no sign posted)?", options: ["60 km/h", "70 km/h", "80 km/h", "100 km/h"], correct: 2 },
  { q: "On motorways, what is the general speed limit in summer?", options: ["100 km/h", "110 km/h", "120 km/h", "130 km/h"], correct: 2 },
  { q: "What does a solid yellow line in the middle of the road mean?", options: ["Passing allowed both directions", "No passing allowed", "Bus lane only", "Parking allowed"], correct: 1 },
  { q: "When must you use headlights while driving in Finland?", options: ["Only at night", "Only in fog", "At all times, day and night", "Only on motorways"], correct: 2 },
  { q: "What is the legal blood alcohol limit for driving in Finland?", options: ["0.0 per mille", "0.2 per mille", "0.5 per mille", "0.8 per mille"], correct: 2 },
  { q: "At a yield (give way) sign, you must:", options: ["Stop completely always", "Give way to traffic on the priority road", "Speed up to merge", "Only yield to buses"], correct: 1 },
  { q: "What does a triangular road sign with a red border generally indicate?", options: ["Mandatory action", "Warning of danger ahead", "Prohibition", "Information"], correct: 1 },
  { q: "How many hours of supervised practice driving are typically required before the B-license driving test in Finland?", options: ["10 hours", "18 hours", "25 hours", "40 hours"], correct: 1 },
  { q: "What is the minimum age to start driving lessons for a car license (B) in Finland?", options: ["15 years", "16 years", "17 years", "18 years"], correct: 2 },
  { q: "A round blue sign with a white arrow pointing up means:", options: ["No entry", "Mandatory direction: straight ahead", "Parking permitted", "One-way street ends"], correct: 1 },
  { q: "When approaching a pedestrian crossing without traffic lights, you must:", options: ["Always stop", "Give way to pedestrians already on or clearly about to cross", "Only slow down if pedestrians wave", "Ignore unless a policeman is present"], correct: 1 },
  { q: "What does a flashing yellow traffic light mean?", options: ["Stop completely", "Proceed with caution, no one has right of way automatically", "Right of way is yours", "Signal malfunction, wait for green"], correct: 1 },
  { q: "In winter, when are winter tires mandatory in Finland?", options: ["November to March, always", "December 1 to end of February at minimum, and whenever conditions require", "Never mandatory", "Only for trucks"], correct: 1 },
  { q: "What is the minimum tread depth for winter tires in Finland?", options: ["1.0 mm", "1.6 mm", "3.0 mm", "5.0 mm"], correct: 2 },
  { q: "At an unmarked intersection with no signs, who has right of way?", options: ["The faster vehicle", "Vehicle coming from the right", "Vehicle coming from the left", "Whoever arrives first"], correct: 1 },
  { q: "What does a red circular sign with a white horizontal bar mean?", options: ["No stopping", "No entry for all vehicles", "Speed limit ends", "Roundabout ahead"], correct: 1 },
  { q: "When driving in a roundabout, who generally has priority?", options: ["Vehicles entering the roundabout", "Vehicles already in the roundabout", "Whichever vehicle is bigger", "Vehicles on the right"], correct: 1 },
  { q: "What should you do if an ambulance approaches with sirens and lights on?", options: ["Speed up to get out of the way", "Ignore it if you have a green light", "Give way and let it pass safely, pulling aside if needed", "Stop in the middle of the lane"], correct: 2 },
  { q: "What is the seatbelt rule for passengers in a car in Finland?", options: ["Only front seat passengers must wear one", "All passengers must wear seatbelts if available", "Only required outside cities", "Only the driver must wear one"], correct: 1 },
  { q: "What does a blue rectangular sign with a white 'P' indicate?", options: ["Prohibited zone", "Parking allowed", "Petrol station", "Pedestrian zone"], correct: 1 },
  { q: "When two vehicles meet on a narrow road with a passing place, who should use it?", options: ["The vehicle nearest to it, or the smaller/more maneuverable one", "Always the one going uphill", "Always the one going downhill", "Neither, both must stop"], correct: 0 },
  { q: "What does a triangular sign showing a deer mean?", options: ["Zoo ahead", "Risk of wild animals crossing the road", "Hunting area", "No wildlife allowed"], correct: 1 },
  { q: "How close behind another vehicle should you follow on a highway at higher speeds?", options: ["As close as possible to save fuel", "About a 3-second gap or more", "Exactly 1 meter", "It doesn't matter"], correct: 1 },
  { q: "What must you do before overtaking another vehicle?", options: ["Just flash your lights", "Ensure the way ahead is clear and it's safe and legal to do so", "Only check your mirror once", "Sound your horn and go"], correct: 1 },
  { q: "A sign showing a red triangle with an exclamation mark generally means:", options: ["General danger warning, details often on a sub-plate", "Give way", "No overtaking", "End of restriction"], correct: 0 },
  { q: "What is the rule about using a mobile phone while driving in Finland?", options: ["Fully allowed anytime", "Only hands-free / mounted use without holding it is allowed", "Only allowed at red lights", "No rule exists"], correct: 1 },
  { q: "When can you cross a solid single white line in the middle of the road?", options: ["Anytime it's safe", "Never, unless avoiding an obstacle or in an emergency", "Only during the day", "Only on motorways"], correct: 1 },
  { q: "What does it mean if a school zone sign is posted?", options: ["No cars ever allowed", "Reduced speed and extra caution needed, children may be nearby", "Only buses may pass", "Sign is purely decorative"], correct: 1 },
  { q: "What should you do at a railway level crossing when lights start flashing?", options: ["Speed across before the train arrives", "Stop and wait, do not cross", "Only stop if you see the train", "Sound horn and proceed"], correct: 1 }
];

// ---------- Room management ----------
const rooms = {};
const QUESTIONS_PER_GAME = 10;
const ROUND_TIME_MS = 15000;

function genCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code;
  do {
    code = Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  } while (rooms[code]);
  return code;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function publicPlayers(room) {
  return Object.entries(room.players).map(([id, p]) => ({ id, name: p.name, score: p.score }));
}

function startQuestion(code) {
  const room = rooms[code];
  if (!room) return;
  if (room.currentQIndex >= room.questionOrder.length) {
    room.state = 'finished';
    const players = publicPlayers(room).sort((a, b) => b.score - a.score);
    io.to(code).emit('gameOver', { players });
    return;
  }
  const qData = QUESTIONS[room.questionOrder[room.currentQIndex]];
  room.answersThisRound = {};
  room.questionStartTime = Date.now();
  room.state = 'question';
  io.to(code).emit('question', {
    index: room.currentQIndex + 1,
    total: room.questionOrder.length,
    q: qData.q,
    options: qData.options,
    timeMs: ROUND_TIME_MS
  });
  clearTimeout(room.timer);
  room.timer = setTimeout(() => endQuestion(code), ROUND_TIME_MS);
}

function endQuestion(code) {
  const room = rooms[code];
  if (!room || room.state !== 'question') return;
  room.state = 'reveal';
  const qData = QUESTIONS[room.questionOrder[room.currentQIndex]];
  io.to(code).emit('reveal', {
    correct: qData.correct,
    players: publicPlayers(room).sort((a, b) => b.score - a.score)
  });
  room.currentQIndex += 1;
  clearTimeout(room.timer);
  room.timer = setTimeout(() => startQuestion(code), 3500);
}

io.on('connection', (socket) => {
  socket.on('createRoom', (name) => {
    const code = genCode();
    rooms[code] = {
      players: { [socket.id]: { name: name?.trim().slice(0, 16) || 'Player', score: 0 } },
      hostId: socket.id,
      state: 'lobby',
      currentQIndex: 0,
      questionOrder: [],
      answersThisRound: {},
      timer: null
    };
    socket.join(code);
    socket.emit('roomCreated', { code, players: publicPlayers(rooms[code]), isHost: true });
  });

  socket.on('joinRoom', ({ code, name }) => {
    code = (code || '').toUpperCase().trim();
    const room = rooms[code];
    if (!room) { socket.emit('errorMsg', 'Room not found. Check the code and try again.'); return; }
    if (room.state !== 'lobby') { socket.emit('errorMsg', 'That game already started.'); return; }
    room.players[socket.id] = { name: name?.trim().slice(0, 16) || 'Player', score: 0 };
    socket.join(code);
    io.to(code).emit('lobbyUpdate', { players: publicPlayers(room) });
    socket.emit('roomJoined', { code, players: publicPlayers(room), isHost: false });
  });

  socket.on('startGame', (code) => {
    const room = rooms[code];
    if (!room || room.hostId !== socket.id || room.state !== 'lobby') return;
    const order = shuffle(QUESTIONS.map((_, i) => i)).slice(0, Math.min(QUESTIONS_PER_GAME, QUESTIONS.length));
    room.questionOrder = order;
    room.currentQIndex = 0;
    Object.values(room.players).forEach(p => p.score = 0);
    startQuestion(code);
  });

  socket.on('submitAnswer', ({ code, choice }) => {
    const room = rooms[code];
    if (!room || room.state !== 'question') return;
    if (room.answersThisRound[socket.id] !== undefined) return;
    const qData = QUESTIONS[room.questionOrder[room.currentQIndex]];
    const elapsed = Date.now() - room.questionStartTime;
    room.answersThisRound[socket.id] = choice;
    let gained = 0;
    if (choice === qData.correct) {
      const speedBonus = Math.max(0, Math.round(500 * (1 - elapsed / ROUND_TIME_MS)));
      gained = 500 + speedBonus;
      room.players[socket.id].score += gained;
    }
    socket.emit('answerReceived', { correct: choice === qData.correct, gained });
    const allAnswered = Object.keys(room.players).every(id => room.answersThisRound[id] !== undefined);
    if (allAnswered) endQuestion(code);
  });

  socket.on('playAgain', (code) => {
    const room = rooms[code];
    if (!room || room.hostId !== socket.id) return;
    room.state = 'lobby';
    Object.values(room.players).forEach(p => p.score = 0);
    io.to(code).emit('backToLobby', { players: publicPlayers(room) });
  });

  socket.on('disconnect', () => {
    for (const code of Object.keys(rooms)) {
      const room = rooms[code];
      if (room.players[socket.id]) {
        delete room.players[socket.id];
        if (Object.keys(room.players).length === 0) {
          clearTimeout(room.timer);
          delete rooms[code];
        } else {
          if (room.hostId === socket.id) room.hostId = Object.keys(room.players)[0];
          io.to(code).emit('lobbyUpdate', { players: publicPlayers(room) });
        }
      }
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Ajokortti Quiz running on port ${PORT}`));
