var request = require('request');

var headers = {
    'origin': 'https://www.facebook.com',
    'accept-language': 'en-US,en;q=0.9',
    'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/65.0.3325.181 Chrome/65.0.3325.181 Safari/537.36',
    'content-type': 'application/x-www-form-urlencoded',
    'accept': '*/*',
    'referer': 'https://www.facebook.com/groups/1416109728606342/edit/',
    'authority': 'www.facebook.com',
    'cookie': 'sb=tHPoWizMTqusrsz3hSsOE_u5; datr=tHPoWtnyYQKIVFX9fcRyODMw; c_user=100006844653943; xs=212%3AgIMxWJu4DAaT2w%3A2%3A1525183426%3A2407%3A15647; pl=n; m_pixel_ratio=1; fr=09osLgdtS16fRR0XY.AWX4OnTx1Z253T_ZZYHttX-f3Yk.Ba6HO0.lw.Fro.0.0.Ba6KJc.AWXqdwTM; x-referer=eyJyIjoiL2dyb3Vwcy8xMDgyNTQ5ODAxNzk0MTQ0P3ZpZXc9cGVybWFsaW5rJmlkPTE2Nzg5NzgxOTU0ODQ2MzIiLCJoIjoiL2dyb3Vwcy8xMDgyNTQ5ODAxNzk0MTQ0P3ZpZXc9cGVybWFsaW5rJmlkPTE2Nzg5NzgxOTU0ODQ2MzIiLCJzIjoibSJ9; wd=980x761; presence=EDvF3EtimeF1525197160EuserFA21B06844653943A2EstateFDutF1525197160501CEchFDp_5f1B06844653943F15CC; act=1525197171322%2F6'
};

var dataString = 'fb_dtsg=AQHL8ycj80Rj%3AAQFumRVh7Ew7&alias=vsbgme&group_id=1416109728606342&__user=100006844653943&__a=1&__dyn=7AgNe-4am2d2u6aJGeFxqewRyWzEy4aheC267Uqzob4q2i5U4e1Fx-K9wPG2OUG4XzEeUK3uczobohwkVUkz8nwvp8S2m4o6e27xu2m7WwuUcFU20wAxCqUpxy5Urwr8467Uy2a1KzoW4Wx28wqqyZ7x3x69wyUy7Vm4S3C4EC2e2bCwjE4K3y&__req=y&__be=1&__pc=PHASED%3ADEFAULT&__rev=3865284&jazoest=2658172765612199106564882106586581701171098286104556911955&__spin_r=3865284&__spin_b=trunk&__spin_t=1525197131';

var options = {
    url: 'https://www.facebook.com/ajax/groups/information/alias_post.php?dpr=1',
    method: 'POST',
    headers: headers,
    body: dataString
};

function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log(body);
    }
}

request(options, callback);
