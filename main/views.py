from django.shortcuts import render, HttpResponse
from django.http import JsonResponse
from redashAPI import RedashAPIClient
from django.views.decorators.csrf import csrf_exempt
import requests
import re
import json

API_KEY = "XmmK1smkzA96tQqSh6cForaTko69VBBCa09GKJ0L"
REDASH_HOST = "https://app.redash.io/dmitriyvasilievich"


def refresh_query(id):
    Redash = RedashAPIClient(API_KEY, REDASH_HOST)
    response = Redash.refresh_query(id)
    return response.json()


def update_query(data):
    pk = data.get("id", None)
    if pk is None:
        return {"message": "Bad request"}
    context = {
        "name": data.get("name", ""),
        "query": data.get("query", ""),
    }
    Redash = RedashAPIClient(API_KEY, REDASH_HOST)
    response = Redash.post(f"queries/{pk}", context)
    return {"payload": response.json()}


# region dashboard

# endregion


def update_visualization(data):
    pk = data.get("id", None)
    querie_id = data.get("querie_id", None)
    if pk is None or querie_id is None:
        return {"message": "Bad request"}
    context = {
        "name": data.get("name", ""),
    }
    Redash = RedashAPIClient(API_KEY, REDASH_HOST)
    Redash.post(f"visualizations/{pk}", context)
    response = Redash.get(f"queries/{querie_id}").json()
    return {"payload": response}


def add_widget(vs_id):
    Redash = RedashAPIClient(API_KEY, REDASH_HOST)
    response = Redash.add_widget(db_id=84180, vs_id=vs_id)
    return response.json()


def delete_widget(id):
    Redash = RedashAPIClient(API_KEY, REDASH_HOST)
    response = Redash.delete(f"widgets/{id}")
    return response.status_code


def get_dashboards(*args, **kwargs):
    Redash = RedashAPIClient(API_KEY, REDASH_HOST)
    response = Redash.get("dashboards").json()
    return {"payload": response}


def get_dashboard(data, *args, **kwargs):
    slug = data.get("id", None)
    if slug is None:
        return {"message": "Bad request"}
    Redash = RedashAPIClient(API_KEY, REDASH_HOST)
    response = Redash.get(f"dashboards/{slug}").json()
    return {"payload": response}


def get_all_dashboards(*args, **kwargs):
    dashboards = list()
    for dashboard in get_dashboards()["results"]:
        dashboards.append(get_dashboard(dashboard["slug"]))
    return {"payload": dashboards}


def update_dashboard(data):
    print(data)
    # return {"message": "Bad request"}
    pk = data.get("id", None)
    if pk is None:
        return {"message": "Bad request"}
    context = {
        "name": data.get("name", ""),
        "tags": data.get("tags", "").split(","),
    }
    Redash = RedashAPIClient(API_KEY, REDASH_HOST)
    response = Redash.post(f"dashboards/{pk}", context)
    return {"payload": response.json()}


@csrf_exempt
def get_single_dashboard(request, pk=None):
    if not pk:
        return JsonResponse({"message": "bad_data"})
    Redash = RedashAPIClient(API_KEY, REDASH_HOST)
    response = Redash.get(f"dashboards/{pk}")
    if not response.status_code == 200:
        return JsonResponse({"message": "bad_data"})
    context = {
        "payload": response.json(),
    }
    return JsonResponse(context)


def set_visualization_list(data):
    slug = data.get("slug", None)
    if slug is None:
        return {"message": "Bad request"}
    print(data)
    splited_list = data.get("visualization_list", "").split(",")
    vis_list = (
        len(splited_list) > 0
        and not splited_list[0] == ""
        and [int(x) for x in splited_list]
        or []
    )
    Redash = RedashAPIClient(API_KEY, REDASH_HOST)
    response = Redash.get(f"dashboards/{slug}").json()
    pk = response["id"]
    for x in response["widgets"]:
        Redash.delete(f"widgets/{x['id']}")
    # print(pk)
    print(vis_list)
    for i, x in enumerate(vis_list):
        Redash.add_widget(pk, vs_id=x, full_width=True)
        # context = {
        #     "dashboard_id": pk,
        #     "visualization_id": x,
        #     "width": 1,
        #     "options": {
        #         # "position": {
        #         #     "col": 0,
        #         #     "row": i * 3,
        #         #     "sizeX": 6,
        #         #     "sizeY": 8,
        #         # }
        #         "position": Redash.calculate_widget_position(pk, full_width=True)
        #     },
        # }
        # print(context)
        # a = Redash.post("widgets", context)
        # print(a.json()["visualizations"])
    response = Redash.get(f"dashboards/{slug}").json()
    # response = list()

    return {"payload": response}


def get_all_visualization(*args, **kwargs):
    Redash = RedashAPIClient(API_KEY, REDASH_HOST)
    queries = Redash.get(f"queries").json()
    response = []
    for x in queries["results"]:
        for z in Redash.get(f"queries/{x['id']}").json()["visualizations"]:
            z["querie_id"] = x["id"]
            z["query"] = x["query"]
            response.append(z)
    # response = [Redash.get(f"queries/{x['id']}").json()['visualizations'] for x in queries["results"]]
    return {"payload": response}
    # return {"payload": queries}


def update_query_list(query_list):
    Redash = RedashAPIClient(API_KEY, REDASH_HOST)
    response = list()
    for x in query_list:
        context = {
            "query": x["query"],
        }
        querie = Redash.post(f'queries/{x["id"]}', context).json()
        response.append(querie)
    return {"payload": response}


def get_all_queries(*args, **kwargs):
    Redash = RedashAPIClient(API_KEY, REDASH_HOST)
    response = Redash.get(f"queries").json()
    return {"payload": response}


def get_querie(data, *args, **kwargs):
    pk = data.get("id", None)
    if pk is None:
        return {"message": "Bad request"}
    Redash = RedashAPIClient(API_KEY, REDASH_HOST)
    response = Redash.get(f"queries/{pk}").json()
    return {"payload": response}


def get_line_options(line, *args, **kwargs):
    context = {
        "showDataLabels": False,
        "direction": {"type": "counterclockwise"},
        "missingValuesAsZero": False,
        "error_y": {"visible": True, "type": "data"},
        "numberFormat": "0,0[.]00000",
        "yAxis": [{"type": "linear"}, {"type": "linear", "opposite": True}],
        "series": {
            "stacking": "stack",
            "percentValues": False,
            "error_y": {"visible": True, "type": "data"},
        },
        "globalSeriesType": "column",
        "percentFormat": "0[.]00%",
        "sortX": True,
        "valuesOptions": {},
        "xAxis": {"labels": {"enabled": True}, "type": "-"},
        "dateTimeFormat": "YYYY-MM-DD HH:mm",
        "columnMapping": {
            "Gpps": "unused",
            line: "y",
            "PointAddress": "series",
            "DateTime": "x",
        },
        "textFormat": "",
        "legend": {"enabled": True},
    }
    return context


def create_visualization(data, *args, **kwargs):
    pk = data.get("id", None)
    if pk is None:
        return {"message": "Bad request"}
    template = data.get("template", "")
    context = {
        "query_id": pk,
        "type": "CHART",
        "name": data.get("name", ""),
        "options": get_line_options(data.get("line", "")) if template == "line" else {},
    }
    Redash = RedashAPIClient(API_KEY, REDASH_HOST)
    Redash.post("visualizations", context)
    response = Redash.get(f"queries/{pk}").json()
    return {"payload": response}


def post_refresh_querrie(data, *args, **kwargs):
    pk = data.get("id", None)
    if pk is None:
        return {"message": "Bad request"}
    context = {"message": "empty"}
    Redash = RedashAPIClient(API_KEY, REDASH_HOST)
    response = Redash.post(f"queries/{pk}/refresh", context).json()
    return {"payload": response}


def create_querrie(data, *args, **kwargs):
    context = {
        "data_source_id": 42671,
        "name": data.get("name", "new querrie"),
        "query": data.get("query", ""),
    }
    Redash = RedashAPIClient(API_KEY, REDASH_HOST)
    response = Redash.post(f"queries", context).json()
    return {"payload": response}


def create_dashboard(data, *args, **kwargs):
    Redash = RedashAPIClient(API_KEY, REDASH_HOST)
    context = {"method": "can_create"}
    response = requests.post("http://localhost", data=context).json()
    print(response)
    if not response.get("payload", None) or response["payload"] != True:
        return {"message": "Bad resposne"}
    payload = dict()
    visualizations = list()
    for x, y in [("map", "Карта"), ("chart", "Графики")]:
        payload[x] = create_querrie({"name": f"{x}_querrie", "query": data.get(x, "")})[
            "payload"
        ]
        visualizations.append(payload[x]["visualizations"][0]["id"])
        Redash.post(
            f"visualizations/{visualizations[-1]}",
            {"name": f"{y}_таблица"},
        )
    context = {
        "name": data.get("name", "new dashboard"),
    }
    response = Redash.post(
        f"dashboards", context
    ).json()  # context = {'name': 'Таблица - ' + table_name}
    pk = response.get("id", None)
    slug = response.get("slug", "")
    publish_dashboard({"id": pk})
    for key, name in [
        ("Traffic", "Трафик"),
        ("Gpps", "GPPS"),
        ("sessions", "Сессии"),
        ("devices", "Устройства"),
        ("aps", "Aps"),
    ]:
        r_v = create_visualization(
            {
                "id": payload["chart"]["id"],
                "name": f"{name}_график",
                "line": key,
            }  # 'name': 'График_' + visual_name,
        )["payload"]["visualizations"]
        for x in r_v:
            visualizations = (
                x["id"] not in visualizations
                and visualizations + [x["id"]]
                or visualizations
            )
    set_visualization_list(
        {"slug": slug, "visualization_list": ",".join(str(x) for x in visualizations)}
    )
    context = {
        "name": response.get("name", ""),
        "tags": [
            f"querie_{payload['map']['id']}",
            f"querie_{payload['chart']['id']}",
        ],
    }
    payload["dashboard"] = Redash.post(f"dashboards/{pk}", context).json()
    payload["dashboard"] = Redash.get(f"dashboards/{slug}").json()
    for x in ["map", "chart"]:
        payload[x] = Redash.get(f"queries/{payload[x]['id']}").json()
    return {"payload": payload}


def publish_dashboard(data, *args, **kwargs):
    pk = data.get("id", None)
    if pk is None:
        return {"message": "Bad request"}
    context = {"is_draft": False}
    Redash = RedashAPIClient(API_KEY, REDASH_HOST)
    # Redash.post(f"dashboards/{pk}", context).json()
    response = Redash.post(f"dashboards/{pk}/share", context).json()
    return {"payload": response}


def get_user(data, *args, **kwargs):
    return {"payload": "manager"}


def get_contract_id_query(data, *args, **kwargs):
    return {"payload": {"can_create": False}}


@csrf_exempt
def index_view(request, *args, **kwargs):
    if request.method == "POST":
        method = request.POST.get("method", None)
        print(f"Method: {method}")
        action = globals().get(method, None)
        if not action:
            return JsonResponse({"message": "Bad request"})
        return JsonResponse(action(request.POST))
        if method == "refresh":
            return JsonResponse(refresh_query(request.POST["id"]))
        elif method == "get_all_dashboards":
            return get_dashboards_list(request)
        elif method == "get_single_dashboard":
            return get_single_dashboard(request, request.POST.get("slug", 1))
        elif method == "get_all_visualization":
            return JsonResponse(get_all_visualization())
        elif method == "get_all_queries":
            return JsonResponse(get_all_queries())
        elif method == "update_query":
            query_list = json.loads(request.POST.get("visualization_list", "[]"))
            # print(json.loads(request.POST["visualization_list"])[0])
            # print(request.POST["visualization_list"])
            return JsonResponse(update_query_list(query_list))
        elif method == "set_visualization_list":
            splited_list = request.POST["visualization_list"].split(",")
            vis_list = (
                len(splited_list) > 0
                and not splited_list[0] == ""
                and [int(x) for x in splited_list]
                or []
            )
            # return JsonResponse({"payload": vis_list})
            return JsonResponse(
                set_visualization_list(
                    request.POST.get("slug", 1),
                    vis_list=vis_list,
                )
            )
        elif method == "update_dashboard":
            context = {
                "name": request.POST.get("name", ""),
                "tags": request.POST.get("tags", "").split(","),
            }
            return JsonResponse(update_dashboard(request.POST.get("id", ""), context))
        elif method == "change_query":
            context = {
                "name": request.POST.get("name", ""),
                "query": request.POST.get("query", ""),
            }
            return JsonResponse(update_query(request.POST["id"], context))
        elif method == "add_widget":
            return JsonResponse(add_widget(request.POST.get("id", 1)))
        elif method == "delete_widget":
            return JsonResponse(delete_widget(request.POST.get("id", 1)), safe=False)
        return JsonResponse({"response": "", "message": "Bad data"})
    return render(request, "index.html")


@csrf_exempt
def some_test_view(request):
    res = requests.get(
        url="https://stats.beelinewifi.ru/public/dashboards/X5iqih4OTvq4dLrGrQfOuGTHzRubbnfd71ORXPyk"
    )
    result = re.sub(
        r"/static/", r"https://app.redash.io/static/", res.content.decode("utf-8")
    )
    return HttpResponse(res)


# if method == "change_visualization":
#     context = {
#         "name": request.POST.get("name", "qwe"),
#         "options": {
#             "globalSeriesType": request.POST.get("type", ""),
#             "sortX": True,
#             "legend": {"enabled": True, "placement": "auto"},
#             "yAxis": [{"type": "linear"}, {"type": "linear", "opposite": True}],
#             "xAxis": {"type": "-", "labels": {"enabled": True}},
#             "error_y": {"type": "data", "visible": True},
#             "series": {
#                 "stacking": None,
#                 "error_y": {"type": "data", "visible": True},
#             },
#             "seriesOptions": {},
#             "valuesOptions": {},
#             "columnMapping": {"date": "x", "count": "y"},
#             "direction": {"type": "counterclockwise"},
#             "sizemode": "diameter",
#             "coefficient": 1,
#             "numberFormat": "0,0[.]00000",
#             "percentFormat": "0[.]00%",
#             "textFormat": "",
#             "missingValuesAsZero": True,
#             "showDataLabels": True,
#             "dateTimeFormat": "YYYY-MM-DD HH:mm",
#         },
#     }
# context = (
#     {
#         "name": request.POST.get("name", "qwe"),
#         "options": {
#             "globalSeriesType": request.POST.get("type", ""),
#             "sortX": True,
#             "legend": {"enabled": True, "placement": "auto"},
#             "yAxis": [
#                 {"type": "linear"},
#                 {"type": "linear", "opposite": True},
#             ],
#             "xAxis": {"type": "-", "labels": {"enabled": True}},
#             "error_y": {"type": "data", "visible": True},
#             "series": {
#                 "stacking": None,
#                 "error_y": {"type": "data", "visible": True},
#             },
#             "seriesOptions": {},
#             "valuesOptions": {},
#             "columnMapping": {"date": "x", "count": "y", "name": "series"},
#             "direction": {"type": "counterclockwise"},
#             "sizemode": "diameter",
#             "coefficient": 1,
#             "numberFormat": "0,0[.]00000",
#             "percentFormat": "0[.]00%",
#             "textFormat": "",
#             "missingValuesAsZero": True,
#             "showDataLabels": True,
#             "dateTimeFormat": "YYYY-MM-DD HH:mm",
#         },
#         "updated_at": "2021-02-08T06:35:44.829Z",
#         "created_at": "2021-02-08T06:30:43.103Z",
#     },
# )
# return JsonResponse(
#     update_visualization(request.POST.get("id", 1), context)
# )


"""
def post_refresh_querrie(data, *args, **kwargs):
    pk = data.get("id", None)
    if pk is None:
        return {"message": "Bad request"}
        context = {'message': 'empty'}
        response, status = send_request_with_headers(POST_QUERIES + str(pk) + '/refresh', context=context)
        if not status:
            return {'message': 'Bad response'}
            return {'payload': response}
"""

# 'name': 'Карта_' + contract_id,

# 'select count(*) from default.wifi_sessions, default.wifi_ap_history where INT_IP=NASIPAddress and CONTRACT_ID="IL405" and (Time.now()-INTERVAL 7 day);'