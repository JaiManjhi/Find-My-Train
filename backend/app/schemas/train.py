from app.models.misc import SearchResult
from app.models.train import Station, Train

TrainStatusResponse = Train
TrainSearchResponse = list[SearchResult]

__all__ = ["Station", "Train", "TrainStatusResponse", "TrainSearchResponse"]
