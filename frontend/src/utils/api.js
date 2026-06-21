const API_URL = import.meta.env.DEV
    ? "http://localhost:3000/api/"
    : window.location.origin + "/api/";

export async function get(path) {
    const [res, err] = await fetch(API_URL + path)
        .then((response) => [response, null])
        .catch((error) => [null, error]);

    if (err) return [null, err];

    const json = await res.json();
    if (!res.ok) return [null, new Error(json.message)];

    return [json, null];
}

export async function post(path, data) {
    const reqData = JSON.stringify(Object.fromEntries(data));

    const [res, err] = await fetch(API_URL + path, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: reqData,
    })
        .then((response) => [response, null])
        .catch((error) => [null, error]);

    if (err) return [null, err];

    const json = await res.json();
    if (!res.ok) return [null, new Error(json.message)];

    return [json, null];
}

export async function put(path, data) {
    const reqData = JSON.stringify(Object.fromEntries(data));

    const [res, err] = await fetch(API_URL + path, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: reqData,
    })
        .then((response) => [response, null])
        .catch((error) => [null, error]);

    if (err) return [null, err];

    const json = await res.json();
    if (!res.ok) return [null, new Error(json.message)];

    return [json, null];
}
