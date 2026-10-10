# River — Helpdesk Ticket Management System

<p align="center">
  ![Upl<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400" xmlns:c2pa="http://c2pa.org/manifest"><metadata><c2pa:manifest>AAAWgmp1bWIAAAAeanVtZGMycGEAEQAQgAAAqgA4m3EDYzJwYQAAABZcanVtYgAAAEdqdW1kYzJtYQARABCAAACqADibcQN1cm46YzJwYTpiMDA4NDViZC02NjQ5LTQ1M2YtOTUxMS1mY2QzMmJmYTRhNzMAAAADl2p1bWIAAAApanVtZGMyYXMAEQAQgAAAqgA4m3EDYzJwYS5hc3NlcnRpb25zAAAAALxqdW1iAAAARGp1bWRjYm9yABEAEIAAAKoAOJtxE2MycGEuaW5ncmVkaWVudC52MwAAAAAYYzJzaDrqc9dxCCqFQOcG657dtxAAAABwY2JvcqNpZGM6Zm9ybWF0bWltYWdlL3N2Zyt4bWxqaW5zdGFuY2VJRHgseG1wOmlpZDoyOWUwZTYwNC00ZTg4LTRiMDUtOTI0OS1kM2JmMzdjZGJlMmNscmVsYXRpb25zaGlwaHBhcmVudE9mAAAB4mp1bWIAAABBanVtZGNib3IAEQAQgAAAqgA4m3ETYzJwYS5hY3Rpb25zLnYyAAAAABhjMnNo8yPm2QxY5AkOF9TUbhhczwAAAZljYm9yomdhY3Rpb25zgqJmYWN0aW9ua2MycGEub3BlbmVkanBhcmFtZXRlcnOha2luZ3JlZGllbnRzgaJjdXJseC1zZWxmI2p1bWJmPWMycGEuYXNzZXJ0aW9ucy9jMnBhLmluZ3JlZGllbnQudjNkaGFzaFgghUVTiiD26h1tLhnw7+DdO7HejvsrC/+6ix2jaQbwMKWkZmFjdGlvbngdY29tLmFudGhyb3BpYy5jbGF1ZGUucHJvdmlkZWRqcGFyYW1ldGVyc6F4H2NvbS5hbnRocm9waWMub3JpZ2luLWNvbmZpZGVuY2VndW5rbm93bmtkZXNjcmlwdGlvbnhmQ2xhdWRlIHByb3ZpZGVkIHRoaXMgZmlsZSBhdCB0aGUgcmVxdWVzdCBvZiBhIHVzZXIgYW5kIG1heSBoYXZlIGNyZWF0ZWQgb3IgbW9kaWZpZWQgdGhlIGZpbGUgY29udGVudHMubXNvZnR3YXJlQWdlbnShZG5hbWVmQ2xhdWRlcmFsbEFjdGlvbnNJbmNsdWRlZPUAAADIanVtYgAAAEBqdW1kY2JvcgARABCAAACqADibcRNjMnBhLmhhc2guZGF0YQAAAAAYYzJzaGb3O/U0fYp6wLtAthjGejwAAACAY2JvcqVjYWxnZnNoYTI1NmNwYWRNAAAAAAAAAAAAAAAAAGRoYXNoWCD8Nu6R5hQJ7vzhabubIMD+rJ2K0ITi0GBEYVMxgtCkkWRuYW1lbmp1bWJmIG1hbmlmZXN0amV4Y2x1c2lvbnOBomVzdGFydBiWZmxlbmd0aBkeBAAAAj5qdW1iAAAAJ2p1bWRjMmNsABEAEIAAAKoAOJtxA2MycGEuY2xhaW0udjIAAAACD2Nib3KlY2FsZ2ZzaGEyNTZpc2lnbmF0dXJleE1zZWxmI2p1bWJmPS9jMnBhL3VybjpjMnBhOmIwMDg0NWJkLTY2NDktNDUzZi05NTExLWZjZDMyYmZhNGE3My9jMnBhLnNpZ25hdHVyZWppbnN0YW5jZUlEeCx4bXA6aWlkOmViMGZiMTJlLWE1MDMtNDU0NS1iZTZjLTg1YTZiM2IzOGQxMHJjcmVhdGVkX2Fzc2VydGlvbnODomN1cmx4LXNlbGYjanVtYmY9YzJwYS5hc3NlcnRpb25zL2MycGEuaW5ncmVkaWVudC52M2RoYXNoWCCFRVOKIPbqHW0uGfDv4N07sd6O+ysL/7qLHaNpBvAwpaJjdXJseCpzZWxmI2p1bWJmPWMycGEuYXNzZXJ0aW9ucy9jMnBhLmFjdGlvbnMudjJkaGFzaFggYWr0DViY49jDG2pLx0r4Hdv4CtBFTtu1gWvc3vwntaaiY3VybHgpc2VsZiNqdW1iZj1jMnBhLmFzc2VydGlvbnMvYzJwYS5oYXNoLmRhdGFkaGFzaFggFdT/+5d0S6LnYLf7QpKwySDx7j0Re9Wo5aZyosmHUup0Y2xhaW1fZ2VuZXJhdG9yX2luZm+jZG5hbWVvQW50aHJvcGljIEZpbGVzZ3ZlcnNpb25lMS4wLjBrc3BlY1ZlcnNpb25lMi40LjAAABA4anVtYgAAAChqdW1kYzJjcwARABCAAACqADibcQNjMnBhLnNpZ25hdHVyZQAAABAIY2JvctKEWQISogEmGCFZAgowggIGMIIBjaADAgECAhRA5aAK7sI50L64g/oGQgU9Z1UTADAKBggqhkjOPQQDAzBJMRcwFQYDVQQKEw5BbnRocm9waWMsIFBCQzEuMCwGA1UEAxMlQW50aHJvcGljIENvbnRlbnQgQ3JlZGVudGlhbHMgUm9vdCBDQTAeFw0yNjA4MDcxODQzNTZaFw0yODA4MDYxOTQzNTZaMEQxFzAVBgNVBAoTDkFudGhyb3BpYywgUEJDMSkwJwYDVQQDEyBBbnRocm9waWMgQ2xhdWRlIENvbnRlbnQgU2lnbmluZzBZMBMGByqGSM49AgEGCCqGSM49AwEHA0IABJh6CmvLUBgFFNU0vUKlOVtE6djd17L5SuwX0LemFisBM3dkd/3cyjxFA3Qo5S46fX0/ihY0VZ7mfb9KF703t5OjWDBWMA4GA1UdDwEB/wQEAwIHgDAVBgNVHSUEDjAMBgorBgEEAYPoXgIBMAwGA1UdEwEB/wQCMAAwHwYDVR0jBBgwFoAUzlHiBIFOZFsj+OPEz5o+nMHXXMIwCgYIKoZIzj0EAwMDZwAwZAIwMXMdFJ4BetLLVY7ORuE9noqbbAZOZn/aArXyTwFAZfKrPzxF2vPoJNf1+UCdg1XGAjBwX1zd9WGqYkqmL5SFqw1QySjr1zJfpJM9+1rdDwSPLMOPOjKuiXjoU/pUUeG9RwmhY3BhZFkNngAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPZYQHVu++ddb4gh3NcMLPXMWburdHiHgfdJFmLjaKW3dtAaMA32x7X+tivQaLjUOe+ILSrm7iNPJw9v6nHykJMXjtY=</c2pa:manifest></metadata>
<rect width="400" height="400" rx="90" fill="#0B2447"/>
<rect x="85" y="85" width="230" height="180" rx="45" fill="#2EC4B6"/>
<polygon points="125,255 125,325 190,255" fill="#2EC4B6"/>
<g fill="none" stroke="#0B2447" stroke-width="18" stroke-linecap="round">
<path d="M120 140 q30 -25 60 0 t60 0 t60 0"/>
<path d="M120 175 q30 -25 60 0 t60 0 t60 0" opacity="0.7"/>
<path d="M120 210 q30 -25 60 0 t60 0 t60 0" opacity="0.45"/>
</g>
</svg>
oading river-logo.svg…]()

</p>

<p align="center">
  ![Upl<svg xmlns="http://www.w3.org/2000/svg" width="1120" height="1830" viewBox="0 0 1120 1830" xmlns:c2pa="http://c2pa.org/manifest"><metadata><c2pa:manifest>AAAWgmp1bWIAAAAeanVtZGMycGEAEQAQgAAAqgA4m3EDYzJwYQAAABZcanVtYgAAAEdqdW1kYzJtYQARABCAAACqADibcQN1cm46YzJwYTo0YTE1OTM0My1kZDk1LTRkNTUtODFkZC0xN2U5MjM4MDY1N2MAAAADl2p1bWIAAAApanVtZGMyYXMAEQAQgAAAqgA4m3EDYzJwYS5hc3NlcnRpb25zAAAAALxqdW1iAAAARGp1bWRjYm9yABEAEIAAAKoAOJtxE2MycGEuaW5ncmVkaWVudC52MwAAAAAYYzJzaH9EqhWIl8oQfd6gJFUHGHYAAABwY2JvcqNpZGM6Zm9ybWF0bWltYWdlL3N2Zyt4bWxqaW5zdGFuY2VJRHgseG1wOmlpZDphMWZhNDFjZi0xMTFlLTQ5MTMtOGFjOC1kOGNhYmY4ZDMwMzVscmVsYXRpb25zaGlwaHBhcmVudE9mAAAB4mp1bWIAAABBanVtZGNib3IAEQAQgAAAqgA4m3ETYzJwYS5hY3Rpb25zLnYyAAAAABhjMnNovXXAmv69x8HH+4qi1QyqgQAAAZljYm9yomdhY3Rpb25zgqJmYWN0aW9ua2MycGEub3BlbmVkanBhcmFtZXRlcnOha2luZ3JlZGllbnRzgaJjdXJseC1zZWxmI2p1bWJmPWMycGEuYXNzZXJ0aW9ucy9jMnBhLmluZ3JlZGllbnQudjNkaGFzaFggDoOT+MLv0VHVgl/hDX5/d85iV/aN0Pj6EiRGPL76SuekZmFjdGlvbngdY29tLmFudGhyb3BpYy5jbGF1ZGUucHJvdmlkZWRqcGFyYW1ldGVyc6F4H2NvbS5hbnRocm9waWMub3JpZ2luLWNvbmZpZGVuY2VndW5rbm93bmtkZXNjcmlwdGlvbnhmQ2xhdWRlIHByb3ZpZGVkIHRoaXMgZmlsZSBhdCB0aGUgcmVxdWVzdCBvZiBhIHVzZXIgYW5kIG1heSBoYXZlIGNyZWF0ZWQgb3IgbW9kaWZpZWQgdGhlIGZpbGUgY29udGVudHMubXNvZnR3YXJlQWdlbnShZG5hbWVmQ2xhdWRlcmFsbEFjdGlvbnNJbmNsdWRlZPUAAADIanVtYgAAAEBqdW1kY2JvcgARABCAAACqADibcRNjMnBhLmhhc2guZGF0YQAAAAAYYzJzaGUj3Hg5a057+jIPMG+XwOQAAACAY2JvcqVjYWxnZnNoYTI1NmNwYWRNAAAAAAAAAAAAAAAAAGRoYXNoWCAw8zRM9DywZr807iTOUZFyRAfsIw1dnYbBEIh+AhmpPGRuYW1lbmp1bWJmIG1hbmlmZXN0amV4Y2x1c2lvbnOBomVzdGFydBiaZmxlbmd0aBkeBAAAAj5qdW1iAAAAJ2p1bWRjMmNsABEAEIAAAKoAOJtxA2MycGEuY2xhaW0udjIAAAACD2Nib3KlY2FsZ2ZzaGEyNTZpc2lnbmF0dXJleE1zZWxmI2p1bWJmPS9jMnBhL3VybjpjMnBhOjRhMTU5MzQzLWRkOTUtNGQ1NS04MWRkLTE3ZTkyMzgwNjU3Yy9jMnBhLnNpZ25hdHVyZWppbnN0YW5jZUlEeCx4bXA6aWlkOmFjMzExM2VjLWQwODktNGE1My05OGRmLTBmOTJhMGMyZmMyZnJjcmVhdGVkX2Fzc2VydGlvbnODomN1cmx4LXNlbGYjanVtYmY9YzJwYS5hc3NlcnRpb25zL2MycGEuaW5ncmVkaWVudC52M2RoYXNoWCAOg5P4wu/RUdWCX+ENfn93zmJX9o3Q+PoSJEY8vvpK56JjdXJseCpzZWxmI2p1bWJmPWMycGEuYXNzZXJ0aW9ucy9jMnBhLmFjdGlvbnMudjJkaGFzaFgg+A7gZEaEVrXUJrraUsPH5tlArtDj82PNBrrrDhWrhbCiY3VybHgpc2VsZiNqdW1iZj1jMnBhLmFzc2VydGlvbnMvYzJwYS5oYXNoLmRhdGFkaGFzaFgg2uDKlCVB/CR/SMOr9RO0d43ysR/hnTtp7NwhK/UKd6h0Y2xhaW1fZ2VuZXJhdG9yX2luZm+jZG5hbWVvQW50aHJvcGljIEZpbGVzZ3ZlcnNpb25lMS4wLjBrc3BlY1ZlcnNpb25lMi40LjAAABA4anVtYgAAAChqdW1kYzJjcwARABCAAACqADibcQNjMnBhLnNpZ25hdHVyZQAAABAIY2JvctKEWQISogEmGCFZAgowggIGMIIBjaADAgECAhRA5aAK7sI50L64g/oGQgU9Z1UTADAKBggqhkjOPQQDAzBJMRcwFQYDVQQKEw5BbnRocm9waWMsIFBCQzEuMCwGA1UEAxMlQW50aHJvcGljIENvbnRlbnQgQ3JlZGVudGlhbHMgUm9vdCBDQTAeFw0yNjA4MDcxODQzNTZaFw0yODA4MDYxOTQzNTZaMEQxFzAVBgNVBAoTDkFudGhyb3BpYywgUEJDMSkwJwYDVQQDEyBBbnRocm9waWMgQ2xhdWRlIENvbnRlbnQgU2lnbmluZzBZMBMGByqGSM49AgEGCCqGSM49AwEHA0IABJh6CmvLUBgFFNU0vUKlOVtE6djd17L5SuwX0LemFisBM3dkd/3cyjxFA3Qo5S46fX0/ihY0VZ7mfb9KF703t5OjWDBWMA4GA1UdDwEB/wQEAwIHgDAVBgNVHSUEDjAMBgorBgEEAYPoXgIBMAwGA1UdEwEB/wQCMAAwHwYDVR0jBBgwFoAUzlHiBIFOZFsj+OPEz5o+nMHXXMIwCgYIKoZIzj0EAwMDZwAwZAIwMXMdFJ4BetLLVY7ORuE9noqbbAZOZn/aArXyTwFAZfKrPzxF2vPoJNf1+UCdg1XGAjBwX1zd9WGqYkqmL5SFqw1QySjr1zJfpJM9+1rdDwSPLMOPOjKuiXjoU/pUUeG9RwmhY3BhZFkNngAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPZYQPQCzz/0+5o723ZxSB2L762D6Vwk3Gx6bDjzmmN6eKR/BdJIBq3NAuQ6fu5tpNgxe0UXRWUkfSupPEBKNqqDLgY=</c2pa:manifest></metadata><rect width="1120" height="1830" fill="#0B2447"/><g transform="translate(60,48) scale(0.24)"><rect width="400" height="400" rx="90" fill="#13315C"/><rect x="85" y="85" width="230" height="180" rx="45" fill="#2EC4B6"/><polygon points="125,255 125,325 190,255" fill="#2EC4B6"/><g fill="none" stroke="#0B2447" stroke-width="18" stroke-linecap="round"><path d="M120 140 q30 -25 60 0 t60 0 t60 0"/><path d="M120 175 q30 -25 60 0 t60 0 t60 0" opacity="0.7"/><path d="M120 210 q30 -25 60 0 t60 0 t60 0"/></g></g><text x="185" y="92" font-family="Carlito, Helvetica, Arial, sans-serif" font-size="50" font-weight="bold" fill="#FFFFFF" text-anchor="start" >How River creates a ticket</text><text x="187" y="132" font-family="Carlito, Helvetica, Arial, sans-serif" font-size="25" font-weight="normal" fill="#9FB3C8" text-anchor="start" >The POST /api/tickets flow, from click to MongoDB</text><rect x="330" y="205" width="180" height="56" rx="28" fill="#2EC4B6"/><text x="420" y="242" font-family="Carlito, Helvetica, Arial, sans-serif" font-size="26" font-weight="bold" fill="#0B2447" text-anchor="middle" letter-spacing="3">START</text><line x1="420" y1="261" x2="420" y2="295" stroke="#2EC4B6" stroke-width="3" stroke-linecap="round"/><polygon points="412,283 428,283 420,296" fill="#2EC4B6"/><rect x="210" y="295" width="420" height="70" rx="16" fill="#13315C" stroke="#2EC4B6" stroke-width="2"/><text x="420" y="340.0" font-family="Carlito, Helvetica, Arial, sans-serif" font-size="30" font-weight="bold" fill="#FFFFFF" text-anchor="middle" >Employee submits a ticket</text><circle cx="120" cy="330" r="20" fill="none" stroke="#2EC4B6" stroke-width="2"/><text x="120" y="337" font-family="Carlito, Helvetica, Arial, sans-serif" font-size="22" font-weight="bold" fill="#2EC4B6" text-anchor="middle" >1</text><line x1="420" y1="365" x2="420" y2="399" stroke="#2EC4B6" stroke-width="3" stroke-linecap="round"/><polygon points="412,387 428,387 420,400" fill="#2EC4B6"/><rect x="210" y="399" width="420" height="70" rx="16" fill="#13315C" stroke="#2EC4B6" stroke-width="2"/><text x="420" y="442.0" font-family="DejaVu Sans Mono, monospace" font-size="24" font-weight="normal" fill="#FFFFFF" text-anchor="middle" >POST /api/tickets</text><circle cx="120" cy="434" r="20" fill="none" stroke="#2EC4B6" stroke-width="2"/><text x="120" y="441" font-family="Carlito, Helvetica, Arial, sans-serif" font-size="22" font-weight="bold" fill="#2EC4B6" text-anchor="middle" >2</text><line x1="420" y1="469" x2="420" y2="503" stroke="#2EC4B6" stroke-width="3" stroke-linecap="round"/><polygon points="412,491 428,491 420,504" fill="#2EC4B6"/><polygon points="210,558 420,503 630,558 420,613" fill="#0F3D56" stroke="#2EC4B6" stroke-width="2" stroke-linejoin="round"/><text x="420" y="568" font-family="Carlito, Helvetica, Arial, sans-serif" font-size="28" font-weight="bold" fill="#FFFFFF" text-anchor="middle" >Token provided?</text><line x1="630" y1="558" x2="738" y2="558" stroke="#FF6B6B" stroke-width="3" stroke-linecap="round"/><polygon points="726,550 726,566 739,558" fill="#FF6B6B"/><text x="670" y="544" font-family="Carlito, Helvetica, Arial, sans-serif" font-size="22" font-weight="bold" fill="#FF6B6B" text-anchor="middle" >NO</text><rect x="740" y="520" width="320" height="76" rx="16" fill="#3A1F33" stroke="#FF6B6B" stroke-width="2"/><text x="900" y="556" font-family="Carlito, Helvetica, Arial, sans-serif" font-size="28" font-weight="bold" fill="#FF9B9B" text-anchor="middle" >401 Unauthorized</text><text x="900" y="582" font-family="Carlito, Helvetica, Arial, sans-serif" font-size="20" font-weight="normal" fill="#9FB3C8" text-anchor="middle" >No token sent</text><circle cx="120" cy="558" r="20" fill="none" stroke="#2EC4B6" stroke-width="2"/><text x="120" y="565" font-family="Carlito, Helvetica, Arial, sans-serif" font-size="22" font-weight="bold" fill="#2EC4B6" text-anchor="middle" >3</text><line x1="420" y1="613" x2="420" y2="653" stroke="#2EC4B6" stroke-width="3" stroke-linecap="round"/><polygon points="412,641 428,641 420,654" fill="#2EC4B6"/><text x="436" y="638" font-family="Carlito, Helvetica, Arial, sans-serif" font-size="20" font-weight="bold" fill="#2EC4B6" text-anchor="start" >YES</text><rect x="210" y="653" width="420" height="70" rx="16" fill="#13315C" stroke="#2EC4B6" stroke-width="2"/><text x="420" y="698.0" font-family="Carlito, Helvetica, Arial, sans-serif" font-size="30" font-weight="bold" fill="#FFFFFF" text-anchor="middle" >Verify JWT token</text><circle cx="120" cy="688" r="20" fill="none" stroke="#2EC4B6" stroke-width="2"/><text x="120" y="695" font-family="Carlito, Helvetica, Arial, sans-serif" font-size="22" font-weight="bold" fill="#2EC4B6" text-anchor="middle" >4</text><line x1="420" y1="723" x2="420" y2="757" stroke="#2EC4B6" stroke-width="3" stroke-linecap="round"/><polygon points="412,745 428,745 420,758" fill="#2EC4B6"/><polygon points="210,812 420,757 630,812 420,867" fill="#0F3D56" stroke="#2EC4B6" stroke-width="2" stroke-linejoin="round"/><text x="420" y="822" font-family="Carlito, Helvetica, Arial, sans-serif" font-size="28" font-weight="bold" fill="#FFFFFF" text-anchor="middle" >Active user?</text><line x1="630" y1="812" x2="738" y2="812" stroke="#FF6B6B" stroke-width="3" stroke-linecap="round"/><polygon points="726,804 726,820 739,812" fill="#FF6B6B"/><text x="670" y="798" font-family="Carlito, Helvetica, Arial, sans-serif" font-size="22" font-weight="bold" fill="#FF6B6B" text-anchor="middle" >NO</text><rect x="740" y="774" width="320" height="76" rx="16" fill="#3A1F33" stroke="#FF6B6B" stroke-width="2"/><text x="900" y="810" font-family="Carlito, Helvetica, Arial, sans-serif" font-size="28" font-weight="bold" fill="#FF9B9B" text-anchor="middle" >401 Unauthorized</text><text x="900" y="836" font-family="Carlito, Helvetica, Arial, sans-serif" font-size="20" font-weight="normal" fill="#9FB3C8" text-anchor="middle" >Token not tied to an active user</text><circle cx="120" cy="812" r="20" fill="none" stroke="#2EC4B6" stroke-width="2"/><text x="120" y="819" font-family="Carlito, Helvetica, Arial, sans-serif" font-size="22" font-weight="bold" fill="#2EC4B6" text-anchor="middle" >5</text><line x1="420" y1="867" x2="420" y2="907" stroke="#2EC4B6" stroke-width="3" stroke-linecap="round"/><polygon points="412,895 428,895 420,908" fill="#2EC4B6"/><text x="436" y="892" font-family="Carlito, Helvetica, Arial, sans-serif" font-size="20" font-weight="bold" fill="#2EC4B6" text-anchor="start" >YES</text><rect x="210" y="907" width="420" height="70" rx="16" fill="#13315C" stroke="#2EC4B6" stroke-width="2"/><text x="420" y="952.0" font-family="Carlito, Helvetica, Arial, sans-serif" font-size="30" font-weight="bold" fill="#FFFFFF" text-anchor="middle" >Validate ticket data</text><circle cx="120" cy="942" r="20" fill="none" stroke="#2EC4B6" stroke-width="2"/><text x="120" y="949" font-family="Carlito, Helvetica, Arial, sans-serif" font-size="22" font-weight="bold" fill="#2EC4B6" text-anchor="middle" >6</text><line x1="420" y1="977" x2="420" y2="1011" stroke="#2EC4B6" stroke-width="3" stroke-linecap="round"/><polygon points="412,999 428,999 420,1012" fill="#2EC4B6"/><polygon points="210,1066 420,1011 630,1066 420,1121" fill="#0F3D56" stroke="#2EC4B6" stroke-width="2" stroke-linejoin="round"/><text x="420" y="1076" font-family="Carlito, Helvetica, Arial, sans-serif" font-size="28" font-weight="bold" fill="#FFFFFF" text-anchor="middle" >Input valid?</text><line x1="630" y1="1066" x2="738" y2="1066" stroke="#FF6B6B" stroke-width="3" stroke-linecap="round"/><polygon points="726,1058 726,1074 739,1066" fill="#FF6B6B"/><text x="670" y="1052" font-family="Carlito, Helvetica, Arial, sans-serif" font-size="22" font-weight="bold" fill="#FF6B6B" text-anchor="middle" >NO</text><rect x="740" y="1028" width="320" height="76" rx="16" fill="#3A1F33" stroke="#FF6B6B" stroke-width="2"/><text x="900" y="1064" font-family="Carlito, Helvetica, Arial, sans-serif" font-size="28" font-weight="bold" fill="#FF9B9B" text-anchor="middle" >400 Bad Request</text><text x="900" y="1090" font-family="Carlito, Helvetica, Arial, sans-serif" font-size="20" font-weight="normal" fill="#9FB3C8" text-anchor="middle" >Invalid ticket data</text><circle cx="120" cy="1066" r="20" fill="none" stroke="#2EC4B6" stroke-width="2"/><text x="120" y="1073" font-family="Carlito, Helvetica, Arial, sans-serif" font-size="22" font-weight="bold" fill="#2EC4B6" text-anchor="middle" >7</text><line x1="420" y1="1121" x2="420" y2="1161" stroke="#2EC4B6" stroke-width="3" stroke-linecap="round"/><polygon points="412,1149 428,1149 420,1162" fill="#2EC4B6"/><text x="436" y="1146" font-family="Carlito, Helvetica, Arial, sans-serif" font-size="20" font-weight="bold" fill="#2EC4B6" text-anchor="start" >YES</text><rect x="210" y="1161" width="420" height="262" rx="16" fill="#13315C" stroke="#2EC4B6" stroke-width="2"/><text x="420" y="1207" font-family="Carlito, Helvetica, Arial, sans-serif" font-size="30" font-weight="bold" fill="#FFFFFF" text-anchor="middle" >Create ticket object</text><circle cx="250" cy="1250" r="5" fill="#2EC4B6"/><text x="270" y="1257" font-family="DejaVu Sans Mono, monospace" font-size="22" font-weight="normal" fill="#D6E4F0" text-anchor="start" >creator = user ID</text><circle cx="250" cy="1286" r="5" fill="#2EC4B6"/><text x="270" y="1293" font-family="DejaVu Sans Mono, monospace" font-size="22" font-weight="normal" fill="#D6E4F0" text-anchor="start" >status = OPEN</text><circle cx="250" cy="1322" r="5" fill="#2EC4B6"/><text x="270" y="1329" font-family="DejaVu Sans Mono, monospace" font-size="22" font-weight="normal" fill="#D6E4F0" text-anchor="start" >priority = MEDIUM</text><circle cx="250" cy="1358" r="5" fill="#2EC4B6"/><text x="270" y="1365" font-family="DejaVu Sans Mono, monospace" font-size="22" font-weight="normal" fill="#D6E4F0" text-anchor="start" >assignedTo = null</text><circle cx="250" cy="1394" r="5" fill="#2EC4B6"/><text x="270" y="1401" font-family="DejaVu Sans Mono, monospace" font-size="22" font-weight="normal" fill="#D6E4F0" text-anchor="start" >timestamps = now</text><circle cx="120" cy="1292" r="20" fill="none" stroke="#2EC4B6" stroke-width="2"/><text x="120" y="1299" font-family="Carlito, Helvetica, Arial, sans-serif" font-size="22" font-weight="bold" fill="#2EC4B6" text-anchor="middle" >8</text><line x1="420" y1="1423" x2="420" y2="1457" stroke="#2EC4B6" stroke-width="3" stroke-linecap="round"/><polygon points="412,1445 428,1445 420,1458" fill="#2EC4B6"/><rect x="210" y="1457" width="420" height="70" rx="16" fill="#13315C" stroke="#2EC4B6" stroke-width="2"/><text x="420" y="1502.0" font-family="Carlito, Helvetica, Arial, sans-serif" font-size="30" font-weight="bold" fill="#FFFFFF" text-anchor="middle" >Save ticket to MongoDB</text><circle cx="120" cy="1492" r="20" fill="none" stroke="#2EC4B6" stroke-width="2"/><text x="120" y="1499" font-family="Carlito, Helvetica, Arial, sans-serif" font-size="22" font-weight="bold" fill="#2EC4B6" text-anchor="middle" >9</text><line x1="420" y1="1527" x2="420" y2="1561" stroke="#2EC4B6" stroke-width="3" stroke-linecap="round"/><polygon points="412,1549 428,1549 420,1562" fill="#2EC4B6"/><rect x="210" y="1561" width="420" height="86" rx="16" fill="#0E5A55" stroke="#2EC4B6" stroke-width="2"/><text x="420" y="1600.0" font-family="Carlito, Helvetica, Arial, sans-serif" font-size="30" font-weight="bold" fill="#FFFFFF" text-anchor="middle" >201 Created</text><text x="420" y="1628.0" font-family="Carlito, Helvetica, Arial, sans-serif" font-size="22" font-weight="normal" fill="#9FB3C8" text-anchor="middle" >Returns the ticket details</text><circle cx="120" cy="1604" r="20" fill="none" stroke="#2EC4B6" stroke-width="2"/><text x="120" y="1611" font-family="Carlito, Helvetica, Arial, sans-serif" font-size="22" font-weight="bold" fill="#2EC4B6" text-anchor="middle" >10</text><line x1="420" y1="1647" x2="420" y2="1681" stroke="#2EC4B6" stroke-width="3" stroke-linecap="round"/><polygon points="412,1669 428,1669 420,1682" fill="#2EC4B6"/><rect x="330" y="1681" width="180" height="56" rx="28" fill="#2EC4B6"/><text x="420" y="1718" font-family="Carlito, Helvetica, Arial, sans-serif" font-size="26" font-weight="bold" fill="#0B2447" text-anchor="middle" letter-spacing="3">END</text><text x="560" y="1782" font-family="Carlito, Helvetica, Arial, sans-serif" font-size="22" font-weight="normal" fill="#9FB3C8" text-anchor="middle" >River  |  helpdesk built on the MERN stack</text></svg>oading river-ticket-flow.svg…]()

</p>

<p align="center">
  <strong>Status:</strong> In Development
</p>

## About

River is a helpdesk ticket management system designed to organize technical support requests, track ticket progress, and provide a foundation for role-based support workflows.

The project is being developed incrementally, starting with a secure REST API and expanding toward a complete helpdesk application.

## Technology Stack

- **Node.js** — JavaScript runtime
- **Express 5** — REST API
- **TypeScript** — type-safe backend development
- **MongoDB** — database
- **JWT** — authentication
- **bcrypt** — password hashing
- **Zod** — request validation

## Implemented Features

- User registration and login
- Password hashing with bcrypt
- JWT-based authentication
- Active-account verification
- Role definitions for employees, agents, and administrators
- Ticket creation with validated input
- Ticket categories and priorities
- Default ticket status and priority
- MongoDB indexes for user lookup and ticket queries

> River is a work in progress. Features such as ticket assignment, status management, and the frontend are planned for future development.

## Ticket Creation Workflow

When an authenticated employee submits a ticket, River validates the request, verifies the user's identity, and stores the ticket in MongoDB.

<p align="center">
  <img src="REPLACE_WITH_BACKEND_ALGORITHM_IMAGE_URL" alt="River ticket creation backend workflow" width="800">
</p>

The current ticket creation flow includes:

1. Receive a ticket creation request.
2. Authenticate the user using a JWT.
3. Verify that the account is active.
4. Validate the submitted ticket data.
5. Apply default values and associate the creator.
6. Save the ticket to MongoDB.
7. Return a `201 Created` response.

## API Overview

Base URL for local development: `http://localhost:5000`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Health check |
| POST | `/api/auth/register` | Register an account |
| POST | `/api/auth/login` | Log in |
| GET | `/api/auth/me` | Get the authenticated identity |
| POST | `/api/tickets` | Create a ticket |

Protected endpoints require a valid bearer token:

`Authorization: Bearer <your-token>`

## Getting Started

### Prerequisites

- Node.js and npm
- MongoDB
- Git

### 1. Clone the repository

```bash
git clone https://github.com/feeridev/River.git
cd River/server
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and configure the values:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/river
JWT_SECRET=replace_with_a_long_random_secret
```

Generate a strong secret locally with:

```bash
openssl rand -hex 32
```

Put the generated value in `JWT_SECRET`. Never commit your real `.env` file.

### 4. Start MongoDB

Make sure your MongoDB service is running before starting the API.

On systems using systemd:

```bash
sudo systemctl start mongod
```

### 5. Run the development server

```bash
npm run dev
```

The API runs at `http://localhost:5000`.

### 6. Build for production

```bash
npm run build
npm start
```

## Project Structure

```text
River/
├── .gitignore
└── server/
    ├── scripts/
    ├── src/
    │   ├── config/
    │   ├── middleware/
    │   ├── models/
    │   ├── repositories/
    │   ├── routes/
    │   ├── services/
    │   ├── utils/
    │   ├── validation/
    │   ├── app.ts
    │   └── server.ts
    ├── .env.example
    ├── package.json
    └── tsconfig.json
```

## Roadmap

- [ ] Ticket listing and filtering
- [ ] Ticket assignment to support agents
- [ ] Ticket status updates and resolution
- [ ] Role-based authorization for helpdesk operations
- [ ] Ticket history and comments
- [ ] Automated tests
- [ ] React and TypeScript frontend
- [ ] Deployment and installation documentation

## Development Philosophy

River is built step by step, with an emphasis on understanding the implementation, validating inputs, protecting user accounts, and keeping the codebase maintainable.

## Author

**Farshad Safarkhanloo**

- GitHub: [@feeridev](https://github.com/feeridev)

---

*River is an independent portfolio project and is actively being developed.*
