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


def update_query(id, data):
    Redash = RedashAPIClient(API_KEY, REDASH_HOST)
    response = Redash.post(f"queries/{id}", data)
    return response.json()


def update_visualization(id, data):
    Redash = RedashAPIClient(API_KEY, REDASH_HOST)
    response = Redash.post(f"visualizations/{id}", data)
    return response.json()


def get_query(query_id):
    Redash = RedashAPIClient(API_KEY, REDASH_HOST)
    response = Redash.get(f"queries/{query_id}")
    return response.json()


def get_dashboard(slug="somenewtest"):
    Redash = RedashAPIClient(API_KEY, REDASH_HOST)
    response = Redash.get(f"dashboards/{slug}")
    return response.json()


def add_widget(vs_id):
    Redash = RedashAPIClient(API_KEY, REDASH_HOST)
    response = Redash.add_widget(db_id=84180, vs_id=vs_id)
    return response.json()


def delete_widget(id):
    Redash = RedashAPIClient(API_KEY, REDASH_HOST)
    response = Redash.delete(f"widgets/{id}")
    return response.status_code


def get_all_dashboards():
    Redash = RedashAPIClient(API_KEY, REDASH_HOST)
    response = Redash.get("dashboards")
    return response.json()


def get_dashboards(request):
    dashboards = list()
    for dashboard in get_all_dashboards()["results"]:
        dashboards.append(get_dashboard(dashboard["slug"]))
    context = {
        "dashboard": dashboards,
    }
    return JsonResponse(context)


@csrf_exempt
def get_single_dashboard(request, pk=None):
    if not pk:
        return JsonResponse({"message": "bad_data"})
    Redash = RedashAPIClient(API_KEY, REDASH_HOST)
    if request.method == "GET":
        response = Redash.get(f"dashboards/{pk}")
        if not response.status_code == 200:
            return JsonResponse({"message": "bad_data"})
        context = {
            "dashboard": response.json(),
        }
        return JsonResponse(context)
    context = {
        "tags": request.POST.get("tags", "").split(","),
        "name": request.POST.get("name", ""),
    }
    response = Redash.post(f"dashboards/{request.POST.get('id', 1)}", context)
    return JsonResponse({"payload": response.json()})


@csrf_exempt
def index_view(request, *args, **kwargs):
    if request.method == "POST":
        method = request.POST.get("method", None)
        if method == "refresh":
            return JsonResponse(refresh_query(request.POST["id"]))
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
    # dashboard = get_dashboard()
    # dashboard = list()
    # for x in get_all_dashboards()["results"]:
    #     dashboard.append(get_dashboard(x["slug"]))
    # queries = list()
    # for x in dashboard["widgets"]:
    #     q = get_query(x["visualization"]["query"]["id"])
    #     for c in q["visualizations"]:
    #         if c["id"] == x["visualization"]["id"]:
    #             q["v"] = c
    #     queries.append(q)
    # q = get_query(631112)
    # print(q)
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
